import type { Request, Response } from 'express';

/* ============================================================
   notFound.ts — 404 for unmatched API routes. Mounted after all
   routers but before the error handler.
   ============================================================ */

export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
}
