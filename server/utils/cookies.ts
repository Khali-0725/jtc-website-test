import type { CookieOptions, Response } from 'express';
import { env } from '../config/env.js';

/* ============================================================
   cookies.ts — centralized auth cookie names + secure options.
   Access + refresh tokens are delivered as httpOnly cookies so the
   frontend (which sends credentials: 'include' and never stores
   tokens in JS) stays XSS-resilient.
   ============================================================ */

export const ACCESS_COOKIE = 'jtc_access';
export const REFRESH_COOKIE = 'jtc_refresh';

// 15 min / 7 days in ms — kept generous enough to cover token TTLs.
const ACCESS_MAX_AGE = 1000 * 60 * 30;
const REFRESH_MAX_AGE = 1000 * 60 * 60 * 24 * 7;

function baseOptions(): CookieOptions {
  return {
    httpOnly: true,
    secure: env.isProd, // HTTPS-only in production
    sameSite: 'lax',
    domain: env.cookieDomain,
    path: '/',
  };
}

export function setAuthCookies(res: Response, accessToken: string, refreshToken: string): void {
  res.cookie(ACCESS_COOKIE, accessToken, { ...baseOptions(), maxAge: ACCESS_MAX_AGE });
  res.cookie(REFRESH_COOKIE, refreshToken, { ...baseOptions(), maxAge: REFRESH_MAX_AGE });
}

export function clearAuthCookies(res: Response): void {
  const opts = baseOptions();
  res.clearCookie(ACCESS_COOKIE, opts);
  res.clearCookie(REFRESH_COOKIE, opts);
}
