import 'dotenv/config';
import { z } from 'zod';

/* ============================================================
   env.ts — zod-validated environment loader.
   Fails fast at boot if required secrets are missing. In
   production it additionally rejects the placeholder secrets
   shipped in .env.example so they can never reach a live deploy.
   Import `env` anywhere for typed, validated config.
   ============================================================ */

const PLACEHOLDER_SECRETS = new Set([
  'replace_with_long_random_secret',
  'replace_with_different_long_random_secret',
]);

const schema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  // Render (and most PaaS) inject the port to bind on via PORT. Prefer it,
  // then our own SERVER_PORT, then a sensible local default.
  PORT: z.coerce.number().int().positive().optional(),
  SERVER_PORT: z.coerce.number().int().positive().default(4000),

  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),

  JWT_ACCESS_SECRET: z.string().min(16, 'JWT_ACCESS_SECRET must be at least 16 chars'),
  JWT_REFRESH_SECRET: z.string().min(16, 'JWT_REFRESH_SECRET must be at least 16 chars'),
  JWT_ACCESS_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
  COOKIE_SECRET: z.string().min(16, 'COOKIE_SECRET must be at least 16 chars'),

  // Comma-separated list of allowed origins. Falls back to CLIENT_URL.
  CORS_ORIGINS: z.string().optional(),
  CLIENT_URL: z.string().url().default('http://localhost:5173'),
  COOKIE_DOMAIN: z.string().optional(),
  // Render injects the service's public URL automatically. We fold it into
  // the CORS allow-list so the single-origin SPA can call its own /api
  // without any manual configuration on deploy.
  RENDER_EXTERNAL_URL: z.string().url().optional(),
});

const parsed = schema.safeParse(process.env);

if (!parsed.success) {
  const issues = parsed.error.issues
    .map((i) => `  - ${i.path.join('.')}: ${i.message}`)
    .join('\n');
  // eslint-disable-next-line no-console
  console.error(`\nInvalid environment configuration:\n${issues}\n`);
  process.exit(1);
}

const raw = parsed.data;
const isProd = raw.NODE_ENV === 'production';

if (isProd) {
  const weak = [raw.JWT_ACCESS_SECRET, raw.JWT_REFRESH_SECRET, raw.COOKIE_SECRET].filter((s) =>
    PLACEHOLDER_SECRETS.has(s),
  );
  if (weak.length > 0) {
    // eslint-disable-next-line no-console
    console.error('\nRefusing to boot in production with placeholder secrets. Set strong JWT/COOKIE secrets.\n');
    process.exit(1);
  }
  if (raw.JWT_ACCESS_SECRET === raw.JWT_REFRESH_SECRET) {
    // eslint-disable-next-line no-console
    console.error('\nJWT_ACCESS_SECRET and JWT_REFRESH_SECRET must differ in production.\n');
    process.exit(1);
  }
}

const corsOrigins = Array.from(
  new Set(
    (raw.CORS_ORIGINS ?? raw.CLIENT_URL)
      .split(',')
      .map((o) => o.trim())
      .filter(Boolean)
      // Always allow the app's own public origin on Render (single-origin SPA
      // calling its own /api). Render sets RENDER_EXTERNAL_URL automatically.
      .concat(raw.RENDER_EXTERNAL_URL ? [raw.RENDER_EXTERNAL_URL.replace(/\/$/, '')] : []),
  ),
);

export const env = {
  nodeEnv: raw.NODE_ENV,
  isProd,
  isDev: raw.NODE_ENV === 'development',
  port: raw.PORT ?? raw.SERVER_PORT,
  databaseUrl: raw.DATABASE_URL,
  jwt: {
    accessSecret: raw.JWT_ACCESS_SECRET,
    refreshSecret: raw.JWT_REFRESH_SECRET,
    accessExpiresIn: raw.JWT_ACCESS_EXPIRES_IN,
    refreshExpiresIn: raw.JWT_REFRESH_EXPIRES_IN,
  },
  cookieSecret: raw.COOKIE_SECRET,
  cookieDomain: raw.COOKIE_DOMAIN,
  clientUrl: raw.CLIENT_URL,
  corsOrigins,
} as const;

export type Env = typeof env;
