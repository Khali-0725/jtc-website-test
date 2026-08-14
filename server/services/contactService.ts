import type { Prisma, ContactMessage } from '@prisma/client';
import { prisma } from '../config/prisma.js';
import { resolvePagination, listResult } from '../utils/pagination.js';
import { notFound } from '../utils/httpError.js';
import type { ContactListQuery, ContactSubmitInput } from '../validators/contactSchemas.js';

/* ============================================================
   contactService — public submission (honeypot-aware) + staff review.
   ============================================================ */

function serialize(r: ContactMessage) {
  return {
    id: r.id,
    name: r.name,
    email: r.email,
    subject: r.subject,
    message: r.message,
    handled: r.handled,
    handledById: r.handledById,
    handledAt: r.handledAt ? r.handledAt.toISOString() : null,
    createdAt: r.createdAt.toISOString(),
  };
}

export const contactService = {
  async submit(input: ContactSubmitInput) {
    await prisma.contactMessage.create({
      data: {
        name: input.name,
        email: input.email,
        subject: input.subject,
        message: input.message,
      },
    });
    return { ok: true as const };
  },

  async list(query: ContactListQuery) {
    const { page, pageSize, skip, take } = resolvePagination(query.page, query.pageSize, 100);
    const where: Prisma.ContactMessageWhereInput = {};
    if (query.handled !== undefined) where.handled = query.handled;

    const [rows, total] = await Promise.all([
      prisma.contactMessage.findMany({ where, orderBy: { createdAt: 'desc' }, skip, take }),
      prisma.contactMessage.count({ where }),
    ]);
    return listResult(rows.map(serialize), total, { page, pageSize, skip, take });
  },

  async setHandled(id: string, handled: boolean, handledById: string) {
    const existing = await prisma.contactMessage.findUnique({ where: { id } });
    if (!existing) throw notFound('Message not found.');
    const row = await prisma.contactMessage.update({
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
