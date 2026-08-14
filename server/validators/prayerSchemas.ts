import { z } from 'zod';
import { paginationQuery } from './shared.js';

/* Public prayer submission — mirrors PrayerRequestInput.
   `website` is a honeypot: bots fill it, humans never see it. */
export const prayerSubmitSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().toLowerCase().email().max(200),
  request: z.string().trim().min(1).max(4000),
  anonymous: z.boolean().default(false),
  website: z.string().max(200).optional(), // honeypot
});

/* Admin list query: ?handled=true|false & pagination. */
export const prayerListQuerySchema = z.object({
  handled: z.coerce.boolean().optional(),
  ...paginationQuery,
});

export type PrayerSubmitInput = z.infer<typeof prayerSubmitSchema>;
export type PrayerListQuery = z.infer<typeof prayerListQuerySchema>;
