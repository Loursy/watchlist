import mongoose, { Document, Types } from 'mongoose';
import { IListDocument } from './list-interface';

export const listSchema = new mongoose.Schema<IListDocument>({
  name: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  movies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }],
  shareCode: { type: String, unique: true, sparse: true }
}, { timestamps: true });
