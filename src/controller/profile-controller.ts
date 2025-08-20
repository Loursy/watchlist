import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { IUserModel, User } from '@/model';
import {UpdateBody, ChangePasswordBody} from '@/interfaces/user';


export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = res.locals.userId as string;
    const user = await User.findById(userId).select('-passwordHash');

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

export const editProfile = async (
  req: Request<{}, {}, UpdateBody>,
  res: Response
) => {
  try {
    const userId = res.locals.userId as string;
    const { username, email } = req.body;

    const updateData: Partial<IUserModel> = {};
    if (username) updateData.username = username;
    if (email) updateData.email = email;

    if (username || email) {
      const conflictUser = await User.findOne({
        $or: [{ username }, { email }],
        _id: { $ne: userId }
      });

      if (conflictUser) {
        return res.status(400).json({ error: "Username or email already in use" });
      }
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: "No fields to update" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true }
    ).select('-passwordHash');

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

export const changePassword = async (
  req: Request<{}, {}, ChangePasswordBody>,
  res: Response
) => {
  try {
    console.log("🔐 changePassword route triggered");

    const userId = res.locals.userId as string;
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: "Incorrect current password" });
    }

    user.passwordHash = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};