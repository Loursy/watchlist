import mongoose, { Document, Types } from 'mongoose';

export interface IMovie {
  tmdbId: number;
  title: string;
  releaseDate: string;
  posterPath?: string;
  voteAverage?: number;
}

export interface IMovieDocument extends IMovie, Document {
  _id: Types.ObjectId;
}