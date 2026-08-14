import jwt from 'jsonwebtoken';
import { randomBytes, createHash } from 'node:crypto';
import { env } from '../config/env.js';
import type { Role } from '@prisma/client';

/* ============================================================
   jwt.ts — sign/verify access & refresh tokens.
   Access token: short-lived, carries identity + role for RBAC.
   Refresh token: longer-lived, carries a `jti` matched against the
   RefreshToken table so sessions can be rotated and revoked.
   ============================================================ */

export interface AccessTokenClaims {
  sub: string;
  email: string;
  name: string;
  role: Role;
  type: 'access';
}

export interface RefreshTokenClaims {
  sub: string;
  jti: string;
  type: 'refresh';
}

type AccessInput = Omit<AccessTokenClaims, 'type'>;

export function signAccessToken(claims: AccessInput): string {
  return jwt.sign({ ...claims, type: 'access' }, env.jwt.accessSecret, {
    expiresIn: env.jwt.accessExpiresIn as jwt.SignOptions['expiresIn'],
  });
}

export function signRefreshToken(sub: string, jti: string): string {
  return jwt.sign({ sub, jti, type: 'refresh' }, env.jwt.refreshSecret, {
    expiresIn: env.jwt.refreshExpiresIn as jwt.SignOptions['expiresIn'],
  });
}

export function verifyAccessToken(token: string): AccessTokenClaims {
  const decoded = jwt.verify(token, env.jwt.accessSecret) as AccessTokenClaims;
  if (decoded.type !== 'access') throw new Error('Wrong token type');
  return decoded;
}

export function verifyRefreshToken(token: string): RefreshTokenClaims {
  const decoded = jwt.verify(token, env.jwt.refreshSecret) as RefreshTokenClaims;
  if (decoded.type !== 'refresh') throw new Error('Wrong token type');
  return decoded;
}

/* Opaque id for the refresh-token `jti` (also the RefreshToken row id). */
export function newTokenId(): string {
  return randomBytes(24).toString('hex');
}

/* Store only a hash of issued refresh tokens, never the raw value. */
export function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}
