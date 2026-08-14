import { z } from 'zod';
import { paginationQuery, dateString, eventCategoryEnum } from './shared.js';

/* Event list query — mirrors EventQuery in src/services/eventService.ts */
export const eventQuerySchema = z.object({
  category: z.string().trim().max(40).optional(),
  search: z.string().trim().max(120).optional(),
  upcomingOnly: z.coerce.boolean().optional(),
  ...paginationQuery,
});

export const eventFeaturedQuerySchema = z.object({
  limit: z.coerce.number().int().positive().max(24).optional(),
});

const eventBase = {
  title: z.string().trim().min(2).max(200),
  slug: z
    .string()
    .trim()
    .max(120)
    .regex(/^[a-z0-9-]+$/i, 'Invalid slug')
    .optional(),
  description: z.string().trim().min(1).max(5000),
  category: eventCategoryEnum,
  startDate: dateString,
  endDate: dateString.optional(),
  time: z.string().trim().min(1).max(60),
  locationName: z.string().trim().min(1).max(200),
  address: z.string().trim().max(400).optional(),
  image: z.string().trim().max(2048),
  registrationUrl: z.string().trim().max(2048).optional(),
  featured: z.boolean().optional(),
  published: z.boolean().optional(),
};

export const createEventSchema = z.object(eventBase);
export const updateEventSchema = z.object(eventBase).partial();

export type EventQueryInput = z.infer<typeof eventQuerySchema>;
export type CreateEventInput = z.infer<typeof createEventSchema>;
