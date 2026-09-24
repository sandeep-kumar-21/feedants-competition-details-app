import { z } from 'zod';

export const RegisterAuthSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters long').max(50),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  avatarUrl: z.string().url('Invalid avatar URL').optional(),
});

export const LoginAuthSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export type RegisterAuthDto = z.infer<typeof RegisterAuthSchema>;
export type LoginAuthDto = z.infer<typeof LoginAuthSchema>;

