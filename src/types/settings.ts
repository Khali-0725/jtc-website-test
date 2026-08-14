/* ============================================================
   Site settings — editable branding served by /api/settings.
   Mirrors the Prisma SiteSettings model. Every field is optional;
   when absent the frontend falls back to the built-in siteConfig
   default (see SettingsContext / useSettings).
   ============================================================ */

export interface SiteSettings {
  logoUrl?: string;
  heroImageUrl?: string;
  pageHeaderImageUrl?: string;
  ogImageUrl?: string;
  accentColor?: string;
  updatedAt?: string;
}
