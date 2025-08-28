import axios from 'axios';
import { TMDBMovie } from '@/interfaces/movie';
import { config } from '@/config';

const BASE_URL = 'https://api.themoviedb.org/3';

export const searchMovie = async (query: string, language = 'tr-TR'): Promise<TMDBMovie[]> => {
  const response = await axios.get(`${BASE_URL}/search/movie`, {
    params: {
      api_key: config.tmdbApiKey,
      query,
      language
    }
  });

  return response.data.results;
};
