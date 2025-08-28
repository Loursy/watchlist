import { Movie } from '@/model';

export const findMovieByTmdbId = (tmdbId: number) => {
  return Movie.findOne({ tmdbId });
};

export const createMovie = (data: {
  tmdbId: number;
  title: string;
  releaseDate: string;
  posterPath: string;
  voteAverage: number;
}) => {
  const movie = new Movie(data);
  return movie.save();
};
