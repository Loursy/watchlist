import { Request, Response } from 'express';
import axios from 'axios';
import crypto from 'crypto';
import { List, Movie } from '@/model';
import mongoose from 'mongoose';
import { config } from '@/config';

const TMDB_API_KEY = process.env.TMDB_API_KEY!;
const toObjectId = (id: string) => new mongoose.Types.ObjectId(id);

export const getLists = async (req: Request, res: Response) => {
  const userId = res.locals.userId;
  const lists = await List.find({ userId: toObjectId(userId) }).populate('movies');
  res.json(lists);
};

export const createList = async (req: Request, res: Response) => {
  const { name } = req.body;
  const userId = res.locals.userId;

  if (!name || name.trim() === '') {
    return res.status(400).json({ error: 'Liste adı gerekli' });
  }

  const existing = await List.findOne({
    name,
    userId: toObjectId(userId)
  });

  if (existing) {
    return res.status(409).json({ error: 'Bu isimde zaten bir listen var' });
  }

  const newList = await List.create({
    name,
    userId: toObjectId(userId),
    movies: []
  });

  res.status(201).json({ message: 'Liste oluşturuldu', list: newList });
};

export const addMovieToList = async (req: Request, res: Response) => {
  const listId = req.params.id;
  const { title }: { title: string } = req.body;
  const userId = res.locals.userId;

  if (!title || title.trim() === '') {
    return res.status(400).json({ error: 'Film adı gerekli' });
  }

  const list = await List.findOne({
    _id: listId,
    userId: toObjectId(userId)
  });

  if (!list) {
    return res.status(404).json({ error: 'Liste bulunamadı' });
  }

  const searchRes = await axios.get('https://api.themoviedb.org/3/search/movie', {
    params: {
      api_key: config.tmdbApiKey,
      query: title,
    }
  });

  const results = searchRes.data.results;
  if (!results || results.length === 0) {
    return res.status(404).json({ error: 'Film bulunamadı' });
  }

  const bestMatch = results.find(
    (movie: any) => movie.title.toLowerCase() === title.toLowerCase()
  ) || results[0];

  let movie = await Movie.findOne({ tmdbId: bestMatch.id });
  if (!movie) {
    movie = new Movie({
      tmdbId: bestMatch.id,
      title: bestMatch.title,
      releaseDate: bestMatch.release_date,
      posterPath: bestMatch.poster_path,
      voteAverage: bestMatch.vote_average
    });
    await movie.save();
  }

  if (!list.movies.includes(movie._id)) {
    list.movies.push(movie._id);
    await list.save();
  }

  res.json({
    message: `Film "${movie.title}" listeye eklendi`,
    list
  });
};

export const shareList = async (req: Request, res: Response) => {
  const listId = req.params.id;
  const userId = res.locals.userId;

  const list = await List.findOne({
    _id: listId,
    userId: toObjectId(userId)
  });

  if (!list) {
    return res.status(404).json({ error: 'Liste bulunamadı' });
  }

  if (list.shareCode) {
    return res.json({ shareCode: list.shareCode });
  }

  const code = crypto.randomBytes(6).toString('hex');
  list.shareCode = code;
  await list.save();

  res.json({ shareCode: code });
};

export const getSharedList = async (req: Request, res: Response) => {
  const code = req.params.code;

  const list = await List.findOne({ shareCode: code }).populate('movies');
  if (!list) {
    return res.status(404).json({ error: 'Paylaşım kodu geçersiz' });
  }

  res.json({
    name: list.name,
    movies: list.movies,
    shared: true
  });
};
