import type { Prisma } from '@prisma/client';
import { prisma } from '../config/prisma.js';
import { toEvent } from '../models/serializers.js';
import { resolvePagination, listResult } from '../utils/pagination.js';
import { slugify } from '../utils/slug.js';
import { notFound } from '../utils/httpError.js';
import type { CreateEventInput, EventQueryInput } from '../validators/eventSchemas.js';

/* ============================================================
   eventService — public reads (published only) + admin CRUD.
   ============================================================ */

export const eventService = {
  async list(query: EventQueryInput) {
    const { page, pageSize, skip, take } = resolvePagination(query.page, query.pageSize, 100);
    const where: Prisma.EventWhereInput = { published: true };

    if (query.upcomingOnly) {
      // "Upcoming" = starts today or later (date-only granularity).
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      where.startDate = { gte: today };
    }
    if (query.category) where.category = query.category;
    if (query.search) {
      where.OR = [
        { title: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const [rows, total] = await Promise.all([
      prisma.event.findMany({ where, orderBy: { startDate: 'asc' }, skip, take }),
      prisma.event.count({ where }),
    ]);

    return listResult(rows.map(toEvent), total, { page, pageSize, skip, take });
  },

  async getFeatured(limit = 3) {
    const featured = await prisma.event.findMany({
      where: { published: true, featured: true },
      orderBy: { startDate: 'asc' },
      take: limit,
    });
    if (featured.length > 0) return featured.map(toEvent);
    const fallback = await prisma.event.findMany({
      where: { published: true },
      orderBy: { startDate: 'asc' },
      take: limit,
    });
    return fallback.map(toEvent);
  },

  async getBySlug(slug: string) {
    const row = await prisma.event.findFirst({ where: { slug, published: true } });
    if (!row) throw notFound('Event not found.');
    return toEvent(row);
  },

  async create(input: CreateEventInput) {
    const row = await prisma.event.create({ data: toData(input) });
    return toEvent(row);
  },

  async update(slug: string, input: Partial<CreateEventInput>) {
    const existing = await prisma.event.findUnique({ where: { slug } });
    if (!existing) throw notFound('Event not found.');
    const row = await prisma.event.update({ where: { slug }, data: toData(input, false) });
    return toEvent(row);
  },

  async remove(slug: string) {
    const existing = await prisma.event.findUnique({ where: { slug } });
    if (!existing) throw notFound('Event not found.');
    await prisma.event.delete({ where: { slug } });
  },
};

function toData(input: Partial<CreateEventInput>, isCreate = true): Prisma.EventUncheckedCreateInput {
  const data: Record<string, unknown> = {};
  if (input.title !== undefined) data.title = input.title;
  if (input.slug !== undefined || (isCreate && input.title)) {
    data.slug = input.slug ? slugify(input.slug) : slugify(input.title ?? '');
  }
  if (input.description !== undefined) data.description = input.description;
  if (input.category !== undefined) data.category = input.category;
  if (input.startDate !== undefined) data.startDate = new Date(input.startDate);
  if (input.endDate !== undefined) data.endDate = input.endDate ? new Date(input.endDate) : null;
  if (input.time !== undefined) data.time = input.time;
  if (input.locationName !== undefined) data.locationName = input.locationName;
  if (input.address !== undefined) data.address = input.address || null;
  if (input.image !== undefined) data.image = input.image;
  if (input.registrationUrl !== undefined) data.registrationUrl = input.registrationUrl || null;
  if (input.featured !== undefined) data.featured = input.featured;
  if (input.published !== undefined) data.published = input.published;
  return data as Prisma.EventUncheckedCreateInput;
}
