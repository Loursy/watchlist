export interface IUser {
  username: string;
  email: string;
  passwordHash: string;
}

export type RegisterBody = Pick<IUser, 'username' | 'email'> & { password: string };
export type LoginBody = Pick<IUser, 'username'> & { password: string };
export type UpdateBody = Partial<Pick<IUser, 'username' | 'email'>>;
export type ChangePasswordBody = { oldPassword: string; newPassword: string };