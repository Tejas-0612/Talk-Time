import { z } from "zod";

export const updateSchema = z.object({
  name: z
    .string()
    .min(3, "name must be at least 3 characters")
    .max(20, "name must be no more than 20 characters"),
  bio: z.string().min(6, "Bio must be at least 6 characters"),
});
