import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().trim().pipe(z.email()),
  password: z.string().min(8).max(128),
});

export type RegisterInput = z.infer<typeof registerSchema>;
