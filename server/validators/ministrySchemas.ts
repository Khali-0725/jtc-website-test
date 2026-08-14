import { z } from 'zod';
import { ministryCategoryEnum } from './shared.js';

/* Ministry list query — mirrors ministryService.list(category?) */
export const ministryQuerySchema = z.object({
  category: z.string().trim().max(40).optional(),
});

const ministryBase = {
  name: z.string().trim().min(2).max(200),
  slug: z
    .string()
    .trim()
    .max(120)
    .regex(/^[a-z0-9-]+$/i, 'Invalid slug')
    .optional(),
  category: ministryCategoryEnum,
  tagline: z.string().trim().min(1).max(200),
  description: z.string().trim().min(1).max(5000),
  audience: z.string().trim().min(1).max(200),
  schedule: z.string().trim().min(1).max(200),
  location: z.string().trim().min(1).max(200),
  contactEmail: z.string().trim().email().max(200).optional().or(z.literal('')),
  image: z.string().trim().max(2048),
  ctaLabel: z.string().trim().max(80).optional(),
  ctaUrl: z.string().trim().max(2048).optional(),
  order: z.coerce.number().int().min(0).max(9999).optional(),
};

export const createMinistrySchema = z.object(ministryBase);
export const updateMinistrySchema = z.object(ministryBase).partial();

export type CreateMinistryInput = z.infer<typeof createMinistrySchema>;
