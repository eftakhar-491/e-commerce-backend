import type { Role, UserStatus } from "../modules/user-pre/user.interface";

declare global {
  namespace Express {
    interface User {
      id: string;
      email: string;
      name: string | null;
      role: Role;
      emailVerified: boolean;
      phone: string | null;
      status: UserStatus;
    }

    interface Request {
      file?: {
        path: string;
        filename: string;
        public_id: string;
      };
      uploadedImages?: {
        storageType?: "local" | "cloudinary" | "custom";
        src?: string;
        publicId?: string;
      }[];
    }
  }
}

export {};
