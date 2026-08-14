import type { NextFunction, Request, Response } from 'express';
import { env } from '../config/env.js';

/* ============================================================
   requestLogger.ts — lightweight request logging.
   Logs method, path, status, and duration. Intentionally minimal
   (no bodies/headers) so credentials and PII are never written.
   ============================================================ */

export function requestLogger(req: Request, res: Response, next: NextFunction): void {
  if (env.nodeEnv === 'test') return next();
  const start = Date.now();
  res.on('finish', () => {
    const ms = Date.now() - start;
    // eslint-disable-next-line no-console
    console.log(`${req.method} ${req.originalUrl} ${res.statusCode} ${ms}ms`);
  });
  next();
}
