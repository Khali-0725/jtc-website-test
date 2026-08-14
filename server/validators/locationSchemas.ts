import { z } from 'zod';

/* ServiceTime — mirrors src/types/content.ts ServiceTime. */
export const serviceTimeSchema = z.object({
  day: z.string().trim().min(1).max(40),
  times: z.array(z.string().trim().min(1).max(40)).min(1).max(12),
  note: z.string().trim().max(200).optional(),
});

const locationBase = {
  name: z.string().trim().min(2).max(200),
  slug: z
    .string()
    .trim()
    .max(120)
    .regex(/^[a-z0-9-]+$/i, 'Invalid slug')
    .optional(),
  isMainCampus: z.boolean().optional(),
  addressLine: z.string().trim().min(1).max(300),
  city: z.string().trim().min(1).max(120),
  region: z.string().trim().min(1).max(120),
  country: z.string().trim().min(1).max(120),
  phone: z.string().trim().max(40).optional(),
  email: z.string().trim().email().max(200).optional().or(z.literal('')),
  image: z.string().trim().max(2048),
  mapEmbedUrl: z.string().trim().max(2048).optional(),
  mapLink: z.string().trim().max(2048).optional(),
  serviceTimes: z.array(serviceTimeSchema).max(20).default([]),
  parking: z.string().trim().max(500).optional(),
  accessibility: z.string().trim().max(500).optional(),
};

export const createLocationSchema = z.object(locationBase);
export const updateLocationSchema = z.object(locationBase).partial();

export type CreateLocationInput = z.infer<typeof createLocationSchema>;
