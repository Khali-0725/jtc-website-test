import { z } from 'zod';

const staffBase = {
  name: z.string().trim().min(2).max(200),
  role: z.string().trim().min(1).max(200),
  photo: z.string().trim().max(2048).optional(),
  bio: z.string().trim().max(2000).optional(),
  order: z.coerce.number().int().min(0).max(9999).optional(),
};

export const createStaffSchema = z.object(staffBase);
export const updateStaffSchema = z.object(staffBase).partial();

export type CreateStaffInput = z.infer<typeof createStaffSchema>;
