import { Request, Response } from 'express';
import {
  getUserProfile,
  updateUserProfile,
  changeUserPassword
} from '@/service/profile-service';
import { UpdateBody, ChangePasswordBody } from '@/interfaces/user';

export const getProfile = async (req: Request, res: Response) => {
  try {
    const user = await getUserProfile(res.locals.userId);
    res.json({ user });
  } catch (err: any) {
    res.status(404).json({ error: err.message });
  }
};

export const editProfile = async (
  req: Request<{}, {}, UpdateBody>,
  res: Response
) => {
  try {
    const { username, email } = req.body;
    const updatedUser = await updateUserProfile(res.locals.userId, username, email);
    res.json({ message: 'Profile updated successfully', user: updatedUser });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const changePassword = async (
  req: Request<{}, {}, ChangePasswordBody>,
  res: Response
) => {
  try {
    const { oldPassword, newPassword } = req.body;
    await changeUserPassword(res.locals.userId, oldPassword, newPassword);
    res.json({ message: 'Password changed successfully' });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};
