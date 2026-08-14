import type { NextFunction, Request, RequestHandler, Response } from 'express';

/* ============================================================
   asyncHandler — wraps async route handlers so rejected promises
   are forwarded to Express's error pipeline instead of hanging.
   ============================================================ */

type AsyncRequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<unknown>;

export const asyncHandler =
  (fn: AsyncRequestHandler): RequestHandler =>
  (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
