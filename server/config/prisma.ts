import { PrismaClient } from '@prisma/client';
import { env } from './env.js';

/* ============================================================
   prisma.ts — singleton PrismaClient.
   Reused across the process (and across hot reloads in dev via
   globalThis) to avoid exhausting the database connection pool.
   ============================================================ */

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: env.isDev ? ['warn', 'error'] : ['error'],
  });

if (!env.isProd) globalForPrisma.prisma = prisma;
