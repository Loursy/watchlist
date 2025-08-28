import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {
  findUserByEmailOrUsername,
  findUserByUsername,
  createUser
} from '@/repository/user-repository';

export const registerUser = async (username: string, email: string, password: string) => {
  const existingUser = await findUserByEmailOrUsername(email, username);
  if (existingUser) {
    throw new Error("Username or email is already used.");
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await createUser({ username, email, passwordHash });
};

export const loginUser = async (username: string, password: string) => {
  const user = await findUserByUsername(username);
  if (!user) {
    throw new Error("Cannot find user");
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    throw new Error("Wrong password");
  }

  const token = jwt.sign({ userId: user._id }, 'secret', { expiresIn: '2h' });

  return {
    token,
    user: {
      username: user.username,
      email: user.email,
      id: user._id
    }
  };
};
