import { z } from 'zod';
import { roleEnum, paginationQuery } from './shared.js';

export const userListQuerySchema = z.object({
  role: roleEnum.optional(),
  isActive: z.coerce.boolean().optional(),
  ...paginationQuery,
});

export const createUserSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(200),
  name: z.string().trim().min(2).max(120),
  password: z.string().min(10, 'Password must be at least 10 characters').max(200),
  role: roleEnum.default('STAFF'),
  isActive: z.boolean().default(true),
});

export const updateUserSchema = z
  .object({
    name: z.string().trim().min(2).max(120),
    password: z.string().min(10).max(200),
    role: roleEnum,
    isActive: z.boolean(),
  })
  .partial();

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type UserListQuery = z.infer<typeof userListQuerySchema>;
