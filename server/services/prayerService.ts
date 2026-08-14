import type { Prisma, PrayerRequest } from '@prisma/client';
import { prisma } from '../config/prisma.js';
import { resolvePagination, listResult } from '../utils/pagination.js';
import { notFound } from '../utils/httpError.js';
import type { PrayerListQuery, PrayerSubmitInput } from '../validators/prayerSchemas.js';

/* ============================================================
   prayerService — public submission (honeypot-aware) + staff review.
   The honeypot check happens in the controller so bot traffic is
   silently accepted (200) without ever hitting the database.
   ============================================================ */

function serialize(r: PrayerRequest) {
  return {
    id: r.id,
    name: r.anonymous ? 'Anonymous' : r.name,
    email: r.anonymous ? null : r.email,
    request: r.request,
    anonymous: r.anonymous,
    handled: r.handled,
    handledById: r.handledById,
    handledAt: r.handledAt ? r.handledAt.toISOString() : null,
    createdAt: r.createdAt.toISOString(),
  };
}

export const prayerService = {
  async submit(input: PrayerSubmitInput) {
    await prisma.prayerRequest.create({
      data: {
        name: input.name,
        email: input.email,
        request: input.request,
        anonymous: input.anonymous,
      },
    });
    return { ok: true as const };
  },

  async list(query: PrayerListQuery) {
    const { page, pageSize, skip, take } = resolvePagination(query.page, query.pageSize, 100);
    const where: Prisma.PrayerRequestWhereInput = {};
    if (query.handled !== undefined) where.handled = query.handled;

    const [rows, total] = await Promise.all([
      prisma.prayerRequest.findMany({ where, orderBy: { createdAt: 'desc' }, skip, take }),
      prisma.prayerRequest.count({ where }),
    ]);
    return listResult(rows.map(serialize), total, { page, pageSize, skip, take });
  },

  async setHandled(id: string, handled: boolean, handledById: string) {
    const existing = await prisma.prayerRequest.findUnique({ where: { id } });
    if (!existing) throw notFound('Prayer request not found.');
    const row = await prisma.prayerRequest.update({
      where: { id },
      data: {
        handled,
        handledById: handled ? handledById : null,
        handledAt: handled ? new Date() : null,
      },
    });
    return serialize(row);
  },
};
