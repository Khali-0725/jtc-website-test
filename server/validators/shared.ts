import { z } from 'zod';

/* ============================================================
   shared.ts — reusable zod fragments + domain enums.
   Enum values mirror EventCategory / MinistryCategory / UserRole in
   src/types so API data always matches the frontend unions exactly.
   ============================================================ */

export const eventCategoryEnum = z.enum([
  'Worship',
  'Conference',
  'Outreach',
  'Youth',
  'Kids',
  'Prayer',
  'Community',
  'Special',
]);

export const ministryCategoryEnum = z.enum([
  'Kids',
  'Youth',
  'Young Adults',
  'Families',
  'Worship',
  'Small Groups',
  'Prayer',
  'Outreach',
  'Volunteers',
]);

export const roleEnum = z.enum(['SUPER_ADMIN', 'ADMIN', 'EDITOR', 'STAFF']);

/* Pagination query fragment (?page=&pageSize=), coerced from strings. */
export const paginationQuery = {
  page: z.coerce.number().int().positive().optional(),
  pageSize: z.coerce.number().int().positive().max(100).optional(),
};

/* :slug path param — lowercase URL-safe token. */
export const slugParams = z.object({
  slug: z
    .string()
    .min(1)
    .max(120)
    .regex(/^[a-z0-9-]+$/i, 'Invalid slug'),
});

/* :id path param. */
export const idParams = z.object({ id: z.string().min(1).max(40) });

/* A trimmed, length-bounded ISO date string (YYYY-MM-DD or full ISO). */
export const dateString = z
  .string()
  .min(4)
  .max(40)
  .refine((v) => !Number.isNaN(Date.parse(v)), 'Invalid date');

export const optionalUrl = z.string().url().max(2048).optional().or(z.literal(''));
