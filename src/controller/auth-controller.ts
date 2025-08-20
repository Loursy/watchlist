import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { IUserModel, User } from '@/model';
import { RegisterBody, LoginBody} from '@/interfaces/user';


export const register = async (
  req: Request<{}, {}, RegisterBody>,
  res: Response
) => {
  const { username, email, password } = req.body;

  const existingUser = await User.findOne({ $or: [{ username }, { email }] });
  if (existingUser) {
    return res.status(400).json({ error: "Username or email is already used." });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = new User({ username, email, passwordHash });
  await user.save();

  res.json({ message: "Registered successfully" });
};

export const login = async (
  req: Request<{}, {}, LoginBody>,
  res: Response
) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  if (!user) {
    return res.status(400).json({ error: "Cannot find user" });
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    return res.status(400).json({ error: "Wrong password" });
  }

  const token = jwt.sign({ userId: user._id }, 'secret', { expiresIn: '2h' });

  res.json({
    message: "Login successful",
    token,
    user: {
      username: user.username,
      email: user.email,
      id: user._id
    }
  });
};

