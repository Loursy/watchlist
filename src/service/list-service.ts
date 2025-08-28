import crypto from 'crypto';
import {
    findListsByUser,
    findListByIdAndUser,
    findListByNameAndUser,
    createList,
    saveList,
    findListByShareCode
} from '@/repository/list-repository';
import {
    findMovieByTmdbId,
    createMovie
} from '@/repository/movie-repository';
import { searchMovie } from '@/utils/tmdb';

export const getUserLists = async (userId: string) => {
    return findListsByUser(userId);
};

export const createUserList = async (name: string, userId: string) => {
    if (!name || name.trim() === '') throw new Error('Liste adı gerekli');

    const existing = await findListByNameAndUser(name, userId);
    if (existing) throw new Error('Bu isimde zaten bir listen var');

    return createList(name, userId);
};

export const addMovieToUserList = async (listId: string, userId: string, title: string) => {
    if (!title || title.trim() === '') throw new Error('Film adı gerekli');

    const list = await findListByIdAndUser(listId, userId);
    if (!list) throw new Error('Liste bulunamadı');

    const results = await searchMovie(title);
    if (!results || results.length === 0) throw new Error('Film bulunamadı');

    const bestMatch = results.find(
        (movie) => movie.title.toLowerCase() === title.toLowerCase()
    ) || results[0];

    let movie = await findMovieByTmdbId(bestMatch.id);
    if (!movie) {
        movie = await createMovie({
            tmdbId: bestMatch.id,
            title: bestMatch.title,
            releaseDate: bestMatch.release_date,
            posterPath: bestMatch.poster_path,
            voteAverage: bestMatch.vote_average
        });
    }

    if (!list.movies.includes(movie._id)) {
        list.movies.push(movie._id);
        await saveList(list);
    }

    return { movie, list };
};

export const generateShareCode = async (listId: string, userId: string) => {
    const list = await findListByIdAndUser(listId, userId);
    if (!list) throw new Error('Liste bulunamadı');

    if (list.shareCode) return list.shareCode;

    const code = crypto.randomBytes(6).toString('hex');
    list.shareCode = code;
    await saveList(list);

    return code;
};

export const getListByShareCode = async (code: string) => {
    const list = await findListByShareCode(code);
    if (!list) throw new Error('Paylaşım kodu geçersiz');

    return list;
};
