import { z } from 'zod';

const emailSchema = z.string().trim().email().max(254).transform((email) => email.toLowerCase());
const passwordWithinBcryptLimit = (password: string) => Buffer.byteLength(password, 'utf8') <= 72;

export const registerSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: emailSchema,
  password: z.string().min(12).refine(passwordWithinBcryptLimit, 'Password must not exceed 72 bytes.'),
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1).refine(passwordWithinBcryptLimit, 'Password must not exceed 72 bytes.'),
});
