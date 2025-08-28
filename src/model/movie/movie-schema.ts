import mongoose from 'mongoose'
import { IMovieDocument } from './movie-interface';

export const movieSchema = new mongoose.Schema<IMovieDocument>({
  tmdbId: { type: Number, required: true, unique: true },
  title: { type: String, required: true },
  releaseDate: { type: String, required: true },
  posterPath: { type: String },
  voteAverage: { type: Number }
}, {
  timestamps: true 
});
movieSchema.index({ tmdbId: 1 }, { unique: true });
movieSchema.index({ title: 1 });
movieSchema.index({ voteAverage: -1 });