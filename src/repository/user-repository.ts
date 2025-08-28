import { User } from '@/model';
import { IUser } from '@/interfaces/user';
import mongoose from 'mongoose';

export const findUserByUsername = (username: string) => {
  return User.findOne({ username });
};

export const findUserByEmailOrUsername = (email: string, username: string) => {
  return User.findOne({ $or: [{ email }, { username }] });
};

export const createUser = (userData: Partial<IUser>) => {
  const user = new User(userData);
  return user.save();
};

export const findUserById = (id: string) => {
  return User.findById(new mongoose.Types.ObjectId(id)).select('+passwordHash');
};

export const findUserByIdWithoutPassword = (id: string) => {
  return User.findById(new mongoose.Types.ObjectId(id)).select('-passwordHash');
};

export const findUserByUsernameOrEmailExcludingId = (username?: string, email?: string, excludeId?: string) => {
  return User.findOne({
    $or: [{ username }, { email }],
    _id: { $ne: excludeId }
  });
};

export const updateUserById = (id: string, updateData: Partial<IUser>) => {
  return User.findByIdAndUpdate(id, { $set: updateData }, { new: true }).select('-passwordHash');
};

export const saveUser = (user: InstanceType<typeof User>) => user.save();

