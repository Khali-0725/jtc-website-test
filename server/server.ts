import { createApp } from './app.js';
import { env } from './config/env.js';
import { prisma } from './config/prisma.js';

/* ============================================================
   server.ts — process entry point.
   Boots the Express app, verifies the DB connection, and wires up
   graceful shutdown so Prisma releases its pool cleanly.
   ============================================================ */

async function main() {
  const app = createApp();

  // Fail fast if the database is unreachable at boot.
  await prisma.$connect();

  const server = app.listen(env.port, () => {
    // eslint-disable-next-line no-console
    console.log(`JTC API listening on http://localhost:${env.port} [${env.nodeEnv}]`);
  });

  const shutdown = async (signal: string) => {
    // eslint-disable-next-line no-console
    console.log(`\n${signal} received — shutting down...`);
    server.close(() => {
      void prisma.$disconnect().finally(() => process.exit(0));
    });
    // Force-exit if connections linger.
    setTimeout(() => process.exit(1), 10_000).unref();
  };

  process.on('SIGINT', () => void shutdown('SIGINT'));
  process.on('SIGTERM', () => void shutdown('SIGTERM'));
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('Failed to start server:', err);
  process.exit(1);
});
