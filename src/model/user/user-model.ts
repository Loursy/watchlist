import mongoose from 'mongoose';
import { IUserModel } from './user-interface';
import { userSchema } from './user-schema';

const User = mongoose.model<IUserModel>('User', userSchema);
export default User;
