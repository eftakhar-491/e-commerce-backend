import { z } from "zod";
import { Role, UserStatus } from "./user.interface";

export const updateMeZodSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters long" })
    .max(50, { message: "Name cannot exceed 50 characters" })
    .optional(),
  phone: z
    .string()
    .regex(/^(?:\+8801\d{9}|01\d{9})$/, {
      message:
        "Phone number must be valid for Bangladesh. Format: +8801XXXXXXXXX or 01XXXXXXXXX",
    })
    .optional(),
  image: z.string().url({ message: "Image must be a valid URL" }).optional(),
  status: z.enum([UserStatus.DELETED]).optional(),
});

export const adminUpdateUserZodSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters long" })
    .max(50, { message: "Name cannot exceed 50 characters" })
    .optional(),
  role: z.nativeEnum(Role).optional(),
  emailVerified: z.boolean().optional(),
  status: z.nativeEnum(UserStatus).optional(),
  phone: z
    .string()
    .regex(/^(?:\+8801\d{9}|01\d{9})$/, {
      message:
        "Phone number must be valid for Bangladesh. Format: +8801XXXXXXXXX or 01XXXXXXXXX",
    })
    .optional(),
});

const bdPhoneSchema = z.string().regex(/^(?:\+8801\d{9}|01\d{9})$/, {
  message:
    "Phone number must be valid for Bangladesh. Format: +8801XXXXXXXXX or 01XXXXXXXXX",
});

export const createAddressZodSchema = z.object({
  label: z
    .string()
    .min(2, { message: "Label must be at least 2 characters long" })
    .max(30, { message: "Label cannot exceed 30 characters" })
    .optional(),
  recipient: z
    .string()
    .min(2, { message: "Recipient must be at least 2 characters long" })
    .max(100, { message: "Recipient cannot exceed 100 characters" })
    .optional(),
  phone: bdPhoneSchema.optional(),
  street: z
    .string()
    .min(5, { message: "Street must be at least 5 characters long" })
    .max(255, { message: "Street cannot exceed 255 characters" }),
  city: z
    .string()
    .min(2, { message: "City must be at least 2 characters long" })
    .max(100, { message: "City cannot exceed 100 characters" }),
  state: z
    .string()
    .max(100, { message: "State cannot exceed 100 characters" })
    .optional(),
  zipCode: z
    .string()
    .max(20, { message: "Zip code cannot exceed 20 characters" })
    .optional(),
  country: z
    .string()
    .max(100, { message: "Country cannot exceed 100 characters" })
    .optional(),
  isDefault: z.boolean().optional(),
});

export const updateAddressZodSchema = z
  .object({
    label: z
      .string()
      .min(2, { message: "Label must be at least 2 characters long" })
      .max(30, { message: "Label cannot exceed 30 characters" })
      .optional(),
    recipient: z
      .string()
      .min(2, { message: "Recipient must be at least 2 characters long" })
      .max(100, { message: "Recipient cannot exceed 100 characters" })
      .optional(),
    phone: bdPhoneSchema.optional(),
    street: z
      .string()
      .min(5, { message: "Street must be at least 5 characters long" })
      .max(255, { message: "Street cannot exceed 255 characters" })
      .optional(),
    city: z
      .string()
      .min(2, { message: "City must be at least 2 characters long" })
      .max(100, { message: "City cannot exceed 100 characters" })
      .optional(),
    state: z
      .string()
      .max(100, { message: "State cannot exceed 100 characters" })
      .optional(),
    zipCode: z
      .string()
      .max(20, { message: "Zip code cannot exceed 20 characters" })
      .optional(),
    country: z
      .string()
      .max(100, { message: "Country cannot exceed 100 characters" })
      .optional(),
    isDefault: z.boolean().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required for update",
  });
