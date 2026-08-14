import { z } from 'zod';
import { paginationQuery } from './shared.js';

/* Public contact submission — mirrors ContactMessageInput.
   `website` is a honeypot. */
export const contactSubmitSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().toLowerCase().email().max(200),
  subject: z.string().trim().min(1).max(200),
  message: z.string().trim().min(1).max(4000),
  website: z.string().max(200).optional(), // honeypot
});

export const contactListQuerySchema = z.object({
  handled: z.coerce.boolean().optional(),
  ...paginationQuery,
});

export type ContactSubmitInput = z.infer<typeof contactSubmitSchema>;
export type ContactListQuery = z.infer<typeof contactListQuerySchema>;
