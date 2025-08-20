import mongoose from 'mongoose';
import { IUserModel } from './user-interface';

export const userSchema = new mongoose.Schema<IUserModel>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      minlength: 3,
      maxlength: 20,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      maxlength: 255,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Lütfen geçerli bir e-posta adresi girin',
      ],
    },
    passwordHash: {
      type: String,
      required: true,
    }
  },
  { timestamps: true }
);
