import { z } from 'zod';
import { paginationQuery, dateString } from './shared.js';

/* Sermon list query — mirrors SermonQuery in src/services/sermonService.ts */
export const sermonQuerySchema = z.object({
  search: z.string().trim().max(120).optional(),
  speaker: z.string().trim().max(120).optional(),
  series: z.string().trim().max(120).optional(),
  tag: z.string().trim().max(60).optional(),
  ...paginationQuery,
});

const sermonBase = {
  title: z.string().trim().min(2).max(200),
  slug: z
    .string()
    .trim()
    .max(120)
    .regex(/^[a-z0-9-]+$/i, 'Invalid slug')
    .optional(),
  description: z.string().trim().min(1).max(5000),
  speaker: z.string().trim().min(1).max(120),
  speakerId: z.string().max(40).optional(),
  series: z.string().trim().max(120).optional(),
  seriesId: z.string().max(40).optional(),
  date: dateString,
  durationMinutes: z.coerce.number().int().min(0).max(1000),
  thumbnail: z.string().trim().max(2048),
  videoUrl: z.string().trim().max(2048).optional(),
  audioUrl: z.string().trim().max(2048).optional(),
  tags: z.array(z.string().trim().max(60)).max(30).default([]),
  scripture: z.string().trim().max(200).optional(),
  featured: z.boolean().optional(),
  published: z.boolean().optional(),
};

export const createSermonSchema = z.object(sermonBase);
export const updateSermonSchema = z.object(sermonBase).partial();

export type SermonQueryInput = z.infer<typeof sermonQuerySchema>;
export type CreateSermonInput = z.infer<typeof createSermonSchema>;
