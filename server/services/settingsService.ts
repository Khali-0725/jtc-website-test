import { prisma } from '../config/prisma.js';
import { toSiteSettings } from '../models/serializers.js';
import type { UpdateSettingsInput } from '../validators/settingsSchemas.js';

/* ============================================================
   settingsService — the SiteSettings singleton.
   There is only ever ONE row (id = "singleton"). `get` creates it
   on first access so the public endpoint always returns an object.
   `update` upserts the provided fields; an empty string clears a
   field back to null (the frontend then falls back to siteConfig).
   ============================================================ */

const SINGLETON_ID = 'singleton';

/* Map validated input -> Prisma data. Only touch keys that were sent;
   an empty string becomes null so the frontend uses its default. */
function toData(input: UpdateSettingsInput) {
  const data: Record<string, string | null> = {};
  if (input.logoUrl !== undefined) data.logoUrl = input.logoUrl || null;
  if (input.heroImageUrl !== undefined) data.heroImageUrl = input.heroImageUrl || null;
  if (input.pageHeaderImageUrl !== undefined)
    data.pageHeaderImageUrl = input.pageHeaderImageUrl || null;
  if (input.ogImageUrl !== undefined) data.ogImageUrl = input.ogImageUrl || null;
  if (input.accentColor !== undefined) data.accentColor = input.accentColor || null;
  return data;
}

export const settingsService = {
  async get() {
    const row = await prisma.siteSettings.upsert({
      where: { id: SINGLETON_ID },
      update: {},
      create: { id: SINGLETON_ID },
    });
    return toSiteSettings(row);
  },

  async update(input: UpdateSettingsInput) {
    const data = toData(input);
    const row = await prisma.siteSettings.upsert({
      where: { id: SINGLETON_ID },
      update: data,
      create: { id: SINGLETON_ID, ...data },
    });
    return toSiteSettings(row);
  },
};
