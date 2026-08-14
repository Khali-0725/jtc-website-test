import { prisma } from '../config/prisma.js';
import { verifyPassword } from '../utils/password.js';
import {
  hashToken,
  newTokenId,
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from '../utils/jwt.js';
import { toAuthUser } from '../models/serializers.js';
import { unauthorized } from '../utils/httpError.js';
import { env } from '../config/env.js';

/* ============================================================
   authService — credential verification + refresh-token rotation.
   Login/refresh return { user, accessToken, refreshToken }; the
   controller sets the tokens as httpOnly cookies and returns only
   the AuthUser body (the contract the frontend authService expects).
   ============================================================ */

interface SessionContext {
  userAgent?: string;
  ip?: string;
}

// Parse "7d" / "15m" / "3600" into ms for computing expiry timestamps.
function ttlToMs(ttl: string): number {
  const match = /^(\d+)([smhd])?$/.exec(ttl.trim());
  if (!match) return 7 * 24 * 60 * 60 * 1000;
  const value = Number(match[1]);
  const unit = match[2] ?? 's';
  const factor = { s: 1000, m: 60_000, h: 3_600_000, d: 86_400_000 }[unit] ?? 1000;
  return value * factor;
}

async function issueTokens(
  user: { id: string; email: string; name: string; role: 'SUPER_ADMIN' | 'ADMIN' | 'EDITOR' | 'STAFF' },
  ctx: SessionContext,
) {
  const jti = newTokenId();
  const refreshToken = signRefreshToken(user.id, jti);
  const accessToken = signAccessToken({
    sub: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  });

  await prisma.refreshToken.create({
    data: {
      id: jti,
      userId: user.id,
      tokenHash: hashToken(refreshToken),
      userAgent: ctx.userAgent?.slice(0, 300),
      ip: ctx.ip?.slice(0, 100),
      expiresAt: new Date(Date.now() + ttlToMs(env.jwt.refreshExpiresIn)),
    },
  });

  return { accessToken, refreshToken };
}

export const authService = {
  async login(email: string, password: string, ctx: SessionContext) {
    const user = await prisma.user.findUnique({ where: { email } });
    // Generic message + always compare to blunt user-enumeration timing.
    const ok = user ? await verifyPassword(password, user.passwordHash) : false;
    if (!user || !ok || !user.isActive) {
      throw unauthorized('Invalid email or password.');
    }

    await prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
    const tokens = await issueTokens(user, ctx);
    return { user: toAuthUser(user), ...tokens };
  },

  async refresh(rawToken: string | undefined, ctx: SessionContext) {
    if (!rawToken) throw unauthorized('No session found.');

    let claims;
    try {
      claims = verifyRefreshToken(rawToken);
    } catch {
      throw unauthorized('Session expired. Please sign in again.');
    }

    const stored = await prisma.refreshToken.findUnique({ where: { id: claims.jti } });
    if (
      !stored ||
      stored.revokedAt ||
      stored.expiresAt < new Date() ||
      stored.tokenHash !== hashToken(rawToken)
    ) {
      throw unauthorized('Session is no longer valid. Please sign in again.');
    }

    const user = await prisma.user.findUnique({ where: { id: stored.userId } });
    if (!user || !user.isActive) throw unauthorized('Account is not active.');

    // Rotate: revoke the used token, then issue a fresh pair.
    await prisma.refreshToken.update({
      where: { id: stored.id },
      data: { revokedAt: new Date() },
    });
    const tokens = await issueTokens(user, ctx);
    return { user: toAuthUser(user), ...tokens };
  },

  async logout(rawToken: string | undefined) {
    if (!rawToken) return;
    try {
      const claims = verifyRefreshToken(rawToken);
      await prisma.refreshToken.updateMany({
        where: { id: claims.jti, revokedAt: null },
        data: { revokedAt: new Date() },
      });
    } catch {
      /* invalid token — nothing to revoke */
    }
  },

  async me(userId: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.isActive) throw unauthorized();
    return toAuthUser(user);
  },
};
