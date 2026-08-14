import type { NextFunction, Request, Response } from 'express';
import { verifyAccessToken } from '../utils/jwt.js';
import { unauthorized } from '../utils/httpError.js';
import { ACCESS_COOKIE } from '../utils/cookies.js';

/* ============================================================
   auth.ts — verifies the access JWT and attaches req.user.
   Token source order: httpOnly cookie (primary, used by the SPA)
   then `Authorization: Bearer <token>` (for API clients / tooling).
   ============================================================ */

function extractToken(req: Request): string | null {
  const cookieToken = (req.cookies as Record<string, string> | undefined)?.[ACCESS_COOKIE];
  if (cookieToken) return cookieToken;

  const header = req.headers.authorization;
  if (header?.startsWith('Bearer ')) return header.slice(7).trim();

  return null;
}

export function authenticate(req: Request, _res: Response, next: NextFunction): void {
  const token = extractToken(req);
  if (!token) return next(unauthorized());

  try {
    const claims = verifyAccessToken(token);
    req.user = {
      id: claims.sub,
      email: claims.email,
      name: claims.name,
      role: claims.role,
    };
    next();
  } catch {
    next(unauthorized('Session expired or invalid. Please sign in again.'));
  }
}

/* Optional variant: populate req.user when a valid token is present,
   but never reject. Useful for endpoints with public + enhanced views. */
export function optionalAuthenticate(req: Request, _res: Response, next: NextFunction): void {
  const token = extractToken(req);
  if (!token) return next();
  try {
    const claims = verifyAccessToken(token);
    req.user = { id: claims.sub, email: claims.email, name: claims.name, role: claims.role };
  } catch {
    /* ignore — treat as anonymous */
  }
  next();
}
