import { Request, Response } from 'express';
import {
  getUserLists,
  createUserList,
  addMovieToUserList,
  generateShareCode,
  getListByShareCode
} from '@/service/list-service';

export const getLists = async (req: Request, res: Response) => {
  try {
    const lists = await getUserLists(res.locals.userId);
    res.json(lists);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const createList = async (req: Request, res: Response) => {
  try {
    const list = await createUserList(req.body.name, res.locals.userId);
    res.status(201).json({ message: 'Liste oluşturuldu', list });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const addMovieToList = async (req: Request, res: Response) => {
  try {
    const { movie, list } = await addMovieToUserList(
      req.params.id,
      res.locals.userId,
      req.body.title
    );
    res.json({ message: `Film "${movie.title}" listeye eklendi`, list });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const shareList = async (req: Request, res: Response) => {
  try {
    const code = await generateShareCode(req.params.id, res.locals.userId);
    res.json({ shareCode: code });
  } catch (err: any) {
    res.status(404).json({ error: err.message });
  }
};

export const getSharedList = async (req: Request, res: Response) => {
  try {
    const list = await getListByShareCode(req.params.code);
    res.json({ name: list.name, movies: list.movies, shared: true });
  } catch (err: any) {
    res.status(404).json({ error: err.message });
  }
};
