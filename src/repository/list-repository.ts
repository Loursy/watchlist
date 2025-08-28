import { List } from '@/model';
import mongoose from 'mongoose';

export const toObjectId = (id: string) => new mongoose.Types.ObjectId(id);

export const findListsByUser = (userId: string) => {
  return List.find({ userId: toObjectId(userId) }).populate('movies');
};

export const findListByIdAndUser = (listId: string, userId: string) => {
  return List.findOne({ _id: listId, userId: toObjectId(userId) });
};

export const findListByNameAndUser = (name: string, userId: string) => {
  return List.findOne({ name, userId: toObjectId(userId) });
};

export const createList = (name: string, userId: string) => {
  return List.create({ name, userId: toObjectId(userId), movies: [] });
};

export const saveList = (list: any) => list.save();

export const findListByShareCode = (code: string) => {
  return List.findOne({ shareCode: code }).populate('movies');
};
