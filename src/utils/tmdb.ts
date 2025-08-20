import axios from 'axios';

const TMDB_API_KEY = process.env.TMDB_API_KEY!;
const BASE_URL = 'https://api.themoviedb.org/3';

export interface TMDBMovie {
  id: number;
  title: string;
  release_date: string;
  poster_path: string;
  vote_average: number;
}

export const searchMovie = async (query: string, language = 'tr-TR'): Promise<TMDBMovie[]> => {
  const response = await axios.get(`${BASE_URL}/search/movie`, {
    params: {
      api_key: TMDB_API_KEY,
      query,
      language
    }
  });

  return response.data.results;
};
