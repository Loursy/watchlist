import mongoose, { Document, Types } from 'mongoose';

export interface IList {
  name: string;
  userId: Types.ObjectId;
  movies: Types.ObjectId[];
  shareCode?: string;
}

export interface IListDocument extends IList, Document {
  createdAt: Date;
  updatedAt: Date;
}