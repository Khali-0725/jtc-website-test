import express, { type Express } from 'express';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { env } from './config/env.js';
import apiRoutes from './routes/index.js';
import { requestLogger } from './middleware/requestLogger.js';
import { generalLimiter } from './middleware/rateLimit.js';
import { notFoundHandler } from './middleware/notFound.js';
import { errorHandler } from './middleware/errorHandler.js';

/* ============================================================
   app.ts — assembles the Express application.

   SECURITY POSTURE
   - helmet sets hardened security headers.
   - CORS is locked to CLIENT_URL / CORS_ORIGINS with credentials.
   - JSON body size capped (10kb) to blunt payload-based abuse.
   - Global rate limiting on /api; stricter limits on auth + form
     submissions live in their route modules.
   - Auth tokens ride in httpOnly, sameSite=lax, secure (prod) cookies.
   - All request bodies/queries are zod-validated before controllers.
   - The centralized error handler masks 5xx internals and never
     leaks stack traces to clients.

   DEPLOYMENT
   - In production the same service also serves the built React SPA
     (repo-root /dist). Serving API + frontend from ONE origin means
     the sameSite=lax auth cookies work without cross-site relaxation
     and no CORS is needed for the app's own requests.
   ============================================================ */

// Path to the built frontend. `server/` and the compiled `dist-server/`
// both sit one level under the repo root, so `../dist` resolves correctly
// whether this module runs via tsx (from server/) or compiled (dist-server/).
const moduleDir = path.dirname(fileURLToPath(import.meta.url));
const clientDist = path.resolve(moduleDir, '../dist');

export function createApp(): Express {
  const app = express();

  // Behind a reverse proxy (Nginx, Render, etc.): trust X-Forwarded-*
  // so req.ip and `secure` cookies work correctly.
  app.set('trust proxy', 1);
  app.disable('x-powered-by');

  app.use(
    helmet({
      // The SPA and its assets are served from this same origin. Disable
      // the default CSP so bundled scripts/styles aren't blocked; tighten
      // later with an explicit policy if desired.
      contentSecurityPolicy: false,
      crossOriginResourcePolicy: { policy: 'same-origin' },
    }),
  );

  app.use(
    cors({
      origin(origin, callback) {
        // Allow same-origin / non-browser tools (no Origin header).
        if (!origin || env.corsOrigins.includes(origin)) return callback(null, true);
        callback(new Error('Not allowed by CORS'));
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    }),
  );

  app.use(express.json({ limit: '10kb' }));
  app.use(express.urlencoded({ extended: false, limit: '10kb' }));
  app.use(cookieParser(env.cookieSecret));
  app.use(requestLogger);

  // Global rate limiter across the whole API surface.
  app.use('/api', generalLimiter, apiRoutes);

  // JSON 404 for unmatched API routes (scoped so it never swallows SPA paths).
  app.use('/api', notFoundHandler);

  // In production, serve the built SPA and fall back to index.html for
  // client-side routes (e.g. /sermons, /admin). Skipped in dev, where Vite
  // serves the frontend and proxies /api here.
  if (env.isProd && fs.existsSync(clientDist)) {
    app.use(express.static(clientDist));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(clientDist, 'index.html'));
    });
  } else {
    app.use(notFoundHandler);
  }

  // Centralized error handler LAST.
  app.use(errorHandler);

  return app;
}
