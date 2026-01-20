export enum Role {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
  USER = "USER",
}

export enum UserStatus {
  ACTIVE = "ACTIVE",
  PENDING = "PENDING",
  BLOCKED = "BLOCKED",
  DELETED = "DELETED",
}

export interface IUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  image?: string | null;
  phone: string;
  status: UserStatus;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}
