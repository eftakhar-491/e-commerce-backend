import type { Role, UserStatus } from "../user-pre/user.interface";

export interface IRegisterPayload {
  name: string;
  email: string;
  password: string;
  phone?: string;
  image?: string;
}

export interface ICredentialsLoginPayload {
  email: string;
  password: string;
}

export interface IChangePasswordPayload {
  oldPassword: string;
  newPassword: string;
}

export interface ISetPasswordPayload {
  password: string;
}

export interface IForgotPasswordPayload {
  email: string;
}

export interface IResetPasswordPayload {
  id: string;
  token: string;
  newPassword: string;
}

export interface IAuthUser {
  id: string;
  email: string;
  name: string | null;
  role: Role;
  emailVerified: boolean;
  phone: string | null;
  status: UserStatus;
}
