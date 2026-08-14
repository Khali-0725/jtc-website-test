import rateLimit from 'express-rate-limit';
import { env } from '../config/env.js';

/* ============================================================
   rateLimit.ts — layered rate limiters.
   - generalLimiter: broad protection on the whole /api surface.
   - authLimiter: strict, for login/refresh (brute-force defense).
   - submissionLimiter: strict, for public form posts (spam defense).
   Disabled in test env to keep unit tests deterministic.
   ============================================================ */

const disabled = env.nodeEnv === 'test';

const common = {
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => disabled,
  message: { message: 'Too many requests. Please slow down and try again shortly.' },
};

export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 600,
  ...common,
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10, // login/refresh attempts per window per IP
  ...common,
  message: { message: 'Too many attempts. Please wait a few minutes and try again.' },
});

export const submissionLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 15, // prayer/contact submissions per hour per IP
  ...common,
  message: { message: 'Submission limit reached. Please try again later.' },
});
