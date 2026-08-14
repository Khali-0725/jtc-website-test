import bcrypt from 'bcryptjs';

/* ============================================================
   password.ts — bcrypt hashing/verification.
   Cost factor 12 (>= the 10 minimum) balances security and latency.
   Raw passwords are never logged or persisted.
   ============================================================ */

const SALT_ROUNDS = 12;

export function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, SALT_ROUNDS);
}

export function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}
