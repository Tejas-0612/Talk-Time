import { z } from "zod";

export const passwordChangeSchema = z.object({
  currentPassword: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
  newPassword: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

export const passwordForgetSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
});

export const passwordResetSchema = z.object({
  newPassword: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});
