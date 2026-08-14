import type { NextFunction, Request, Response } from 'express';
import type { Role } from '@prisma/client';
import { forbidden, unauthorized } from '../utils/httpError.js';

/* ============================================================
   rbac.ts — role-based access control.
   Role hierarchy (high -> low): SUPER_ADMIN > ADMIN > EDITOR > STAFF.
   - requireRole(...roles): user's role must be in the allowed set.
   - requireMinRole(role): user's rank must be >= the given role.
   Always chain AFTER `authenticate`.
   ============================================================ */

export const ROLE_RANK: Record<Role, number> = {
  SUPER_ADMIN: 40,
  ADMIN: 30,
  EDITOR: 20,
  STAFF: 10,
};

export function requireRole(...roles: Role[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) return next(unauthorized());
    if (!roles.includes(req.user.role)) return next(forbidden());
    next();
  };
}

export function requireMinRole(minRole: Role) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) return next(unauthorized());
    if (ROLE_RANK[req.user.role] < ROLE_RANK[minRole]) return next(forbidden());
    next();
  };
}

/* Convenience guards for the common tiers used across modules. */
export const requireContentEditor = requireMinRole('EDITOR'); // create/update/delete content
export const requireStaff = requireMinRole('STAFF'); // read submissions
export const requireAdmin = requireMinRole('ADMIN'); // manage users
