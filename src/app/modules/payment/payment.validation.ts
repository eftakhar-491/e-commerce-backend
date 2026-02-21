import { z } from "zod";

export const initiatePaymentZodSchema = z.object({}).strict();

export const sslValidationZodSchema = z
  .object({
    tran_id: z.string().trim().min(1).optional(),
    transactionId: z.string().trim().min(1).optional(),
    val_id: z.string().trim().min(1).optional(),
    status: z.string().trim().min(1).optional(),
    amount: z.union([z.string(), z.number()]).optional(),
  })
  .refine((value) => Boolean(value.tran_id || value.transactionId), {
    message: "tran_id is required",
    path: ["tran_id"],
  });
