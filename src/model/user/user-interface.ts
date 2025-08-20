import mongoose, { Document } from 'mongoose';

export interface IUserBase extends Document {
  username: string;
  email: string;
  passwordHash: string;
}

export interface IUserModel extends IUserBase, Document {
  createdAt: Date;
  updatedAt: Date;
}