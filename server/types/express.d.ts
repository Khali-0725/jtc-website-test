import type { Role } from '@prisma/client';

/* ============================================================
   Express Request augmentation — attaches the authenticated user
   (populated by the `authenticate` middleware) so controllers can
   read req.user with full typing.
   ============================================================ */

export interface RequestUser {
  id: string;
  email: string;
  name: string;
  role: Role;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: RequestUser;
    }
  }
}

export {};
