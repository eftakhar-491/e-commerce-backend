import { z } from "zod";

const passwordSchema = z
  .string()
  .min(8, { message: "Password must be at least 8 characters long" })
  .regex(/^(?=.*[A-Z])/, {
    message: "Password must contain at least 1 uppercase letter",
  })
  .regex(/^(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])/, {
    message: "Password must contain at least 1 special character",
  })
  .regex(/^(?=.*\d)/, {
    message: "Password must contain at least 1 number",
  });

export const registerZodSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters long" })
    .max(50, { message: "Name cannot exceed 50 characters" }),
  email: z.string().email({ message: "Invalid email format" }),
  password: passwordSchema,
  phone: z
    .string()
    .regex(/^(?:\+8801\d{9}|01\d{9})$/, {
      message:
        "Phone number must be valid for Bangladesh. Format: +8801XXXXXXXXX or 01XXXXXXXXX",
    })
    .optional(),
  image: z.string().url({ message: "Image must be a valid URL" }).optional(),
});

export const loginZodSchema = z.object({
  email: z.string().email({ message: "Invalid email format" }),
  password: z.string().min(1, { message: "Password is required" }),
});

export const refreshTokenZodSchema = z.object({
  refreshToken: z.string().min(1, { message: "Refresh token must be a string" }).optional(),
});

export const forgotPasswordZodSchema = z.object({
  email: z.string().email({ message: "Invalid email format" }),
});

export const resetPasswordZodSchema = z.object({
  id: z.string().uuid({ message: "Invalid user id" }),
  token: z.string().min(1, { message: "Reset token is required" }),
  newPassword: passwordSchema,
});

export const changePasswordZodSchema = z.object({
  oldPassword: z.string().min(1, { message: "Old password is required" }),
  newPassword: passwordSchema,
});

export const setPasswordZodSchema = z.object({
  password: passwordSchema,
});
