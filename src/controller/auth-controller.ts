import { Request, Response } from 'express';
import { registerUser, loginUser } from '@/service/auth-service';
import { RegisterBody, LoginBody } from '@/interfaces/user';

export const register = async (
  req: Request<{}, {}, RegisterBody>,
  res: Response
) => {
  const { username, email, password } = req.body;

  try {
    await registerUser(username, email, password);
    res.json({ message: "Registered successfully" });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const login = async (
  req: Request<{}, {}, LoginBody>,
  res: Response
) => {
  const { username, password } = req.body;

  try {
    const result = await loginUser(username, password);
    res.json({ message: "Login successful", ...result });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
