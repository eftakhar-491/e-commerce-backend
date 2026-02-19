export enum Role {
  ADMIN = "ADMIN",
  USER = "USER",
  MANAGER = "MANAGER",
}

export enum UserStatus {
  ACTIVE = "ACTIVE",
  BLOCKED = "BLOCKED",
  DELETED = "DELETED",
}

export interface IUser {
  id: string;
  name: string | null;
  email: string;
  role: Role;
  image?: string | null;
  phone: string | null;
  status: UserStatus;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUpdateMePayload {
  name?: string;
  phone?: string;
  image?: string | null;
  status?: UserStatus;
}

export interface IAdminUpdateUserPayload {
  name?: string;
  role?: Role;
  emailVerified?: boolean;
  status?: UserStatus;
  phone?: string;
}

export interface ICreateAddressPayload {
  label?: string;
  recipient?: string;
  phone?: string;
  street: string;
  city: string;
  state?: string;
  zipCode?: string;
  country?: string;
  isDefault?: boolean;
}

export interface IUpdateAddressPayload {
  label?: string;
  recipient?: string;
  phone?: string;
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  isDefault?: boolean;
}
