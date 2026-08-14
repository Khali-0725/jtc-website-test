import type { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';
import { AppError } from '../utils/httpError.js';
import { env } from '../config/env.js';

/* ============================================================
   errorHandler.ts — centralized error handler (mounted LAST).
   - AppError -> its statusCode + message.
   - ZodError -> 400 with field issues.
   - Prisma known errors -> mapped (unique -> 409, not found -> 404).
   - Everything else -> 500 with a generic message; stack traces are
     never sent to clients and are logged server-side only in dev.
   ============================================================ */

interface ErrorBody {
  message: string;
  details?: unknown;
}

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  let status = 500;
  const body: ErrorBody = { message: 'Something went wrong. Please try again.' };

  if (err instanceof AppError) {
    status = err.statusCode;
    body.message = err.message;
    if (err.details !== undefined && err.expose) body.details = err.details;
  } else if (err instanceof ZodError) {
    status = 400;
    body.message = 'Validation failed';
    body.details = err.issues.map((i) => ({ path: i.path.join('.'), message: i.message }));
  } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      status = 409;
      body.message = 'A record with those details already exists.';
    } else if (err.code === 'P2025') {
      status = 404;
      body.message = 'Resource not found.';
    } else {
      status = 400;
      body.message = 'Database request could not be completed.';
    }
  }

  // Log full detail server-side; never leak internals to the client.
  if (status >= 500) {
    // eslint-disable-next-line no-console
    console.error('[error]', err);
  } else if (env.isDev) {
    // eslint-disable-next-line no-console
    console.warn('[warn]', body.message);
  }

  res.status(status).json(body);
}
