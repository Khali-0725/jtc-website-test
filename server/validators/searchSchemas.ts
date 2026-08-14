import { z } from 'zod';

/* Search query. `q` is length-bounded and treated as a plain-text
   term (Prisma parameterizes it — no SQL injection surface). */
export const searchQuerySchema = z.object({
  q: z.string().trim().max(120).default(''),
});

export type SearchQueryInput = z.infer<typeof searchQuerySchema>;
