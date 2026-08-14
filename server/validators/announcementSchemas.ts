import { z } from 'zod';
import { dateString } from './shared.js';

const announcementBase = {
  title: z.string().trim().min(2).max(200),
  body: z.string().trim().min(1).max(2000),
  date: dateString,
  link: z.string().trim().max(2048).optional(),
  active: z.boolean().optional(),
};

export const createAnnouncementSchema = z.object(announcementBase);
export const updateAnnouncementSchema = z.object(announcementBase).partial();

export type CreateAnnouncementInput = z.infer<typeof createAnnouncementSchema>;
