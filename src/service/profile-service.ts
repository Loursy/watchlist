import bcrypt from 'bcryptjs';
import {
  findUserById,
  findUserByIdWithoutPassword,
  findUserByUsernameOrEmailExcludingId,
  updateUserById,
  saveUser
} from '@/repository/user-repository';

export const getUserProfile = async (userId: string) => {
  const user = await findUserByIdWithoutPassword(userId);
  if (!user) throw new Error('User not found');
  return user;
};

export const updateUserProfile = async (
  userId: string,
  username?: string,
  email?: string
) => {
  const updateData: any = {};
  if (username) updateData.username = username;
  if (email) updateData.email = email;

  if (Object.keys(updateData).length === 0) {
    throw new Error('No fields to update');
  }

  const conflictUser = await findUserByUsernameOrEmailExcludingId(username, email, userId);
  if (conflictUser) {
    throw new Error('Username or email already in use');
  }

  const updatedUser = await updateUserById(userId, updateData);
  if (!updatedUser) throw new Error('User not found');

  return updatedUser;
};

export const changeUserPassword = async (
  userId: string,
  oldPassword: string,
  newPassword: string
) => {
  const user = await findUserById(userId);
  if (!user) throw new Error('User not found');

  const isMatch = await bcrypt.compare(oldPassword, user.passwordHash);
  if (!isMatch) throw new Error('Incorrect current password');
  
  user.passwordHash = await bcrypt.hash(newPassword, 10);
  await saveUser(user);
};
