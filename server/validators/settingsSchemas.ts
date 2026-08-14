import { z } from 'zod';

/* ============================================================
   settingsSchemas — validation for the SiteSettings singleton.
   Every field is optional so the admin can update one at a time.
   An empty string is allowed and CLEARS the value (falls back to
   the built-in siteConfig default on the frontend).
   ============================================================ */

// A public image URL (http/https) OR an empty string to clear it.
const imageUrl = z.string().trim().max(2048).url('Enter a valid URL').or(z.literal(''));

// A CSS hex color (#rgb or #rrggbb) OR an empty string to clear it.
const hexColor = z
  .string()
  .trim()
  .regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, 'Enter a hex color like #35e0ff')
  .or(z.literal(''));

export const updateSettingsSchema = z.object({
  logoUrl: imageUrl.optional(),
  heroImageUrl: imageUrl.optional(),
  pageHeaderImageUrl: imageUrl.optional(),
  ogImageUrl: imageUrl.optional(),
  accentColor: hexColor.optional(),
});

export type UpdateSettingsInput = z.infer<typeof updateSettingsSchema>;
