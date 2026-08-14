import type { Request, Response } from 'express';
import { authService } from '../services/authService.js';
import { setAuthCookies, clearAuthCookies, REFRESH_COOKIE } from '../utils/cookies.js';
import { unauthorized } from '../utils/httpError.js';

/* ============================================================
   authController — HTTP glue for auth.
   Returns the AuthUser JSON body directly (matches the frontend
   authService contract) while delivering tokens via httpOnly cookies.
   ============================================================ */

function sessionContext(req: Request) {
  return { userAgent: req.headers['user-agent'], ip: req.ip };
}

export const authController = {
  async login(req: Request, res: Response) {
    const { email, password } = req.body as { email: string; password: string };
    const { user, accessToken, refreshToken } = await authService.login(
      email,
      password,
      sessionContext(req),
    );
    setAuthCookies(res, accessToken, refreshToken);
    res.json(user);
  },

  async refresh(req: Request, res: Response) {
    const raw = (req.cookies as Record<string, string> | undefined)?.[REFRESH_COOKIE];
    const { user, accessToken, refreshToken } = await authService.refresh(
      raw,
      sessionContext(req),
    );
    setAuthCookies(res, accessToken, refreshToken);
    res.json(user);
  },

  async logout(req: Request, res: Response) {
    const raw = (req.cookies as Record<string, string> | undefined)?.[REFRESH_COOKIE];
    await authService.logout(raw);
    clearAuthCookies(res);
    res.status(204).send();
  },

  async me(req: Request, res: Response) {
    if (!req.user) throw unauthorized();
    const user = await authService.me(req.user.id);
    res.json(user);
  },
};
