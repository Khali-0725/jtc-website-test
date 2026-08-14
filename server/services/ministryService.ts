import type { Prisma } from '@prisma/client';
import { prisma } from '../config/prisma.js';
import { toMinistry } from '../models/serializers.js';
import { slugify } from '../utils/slug.js';
import { notFound } from '../utils/httpError.js';
import type { CreateMinistryInput } from '../validators/ministrySchemas.js';

/* ============================================================
   ministryService — public reads + admin CRUD.
   ============================================================ */

export const ministryService = {
  async list(category?: string) {
    const where: Prisma.MinistryWhereInput = category ? { category } : {};
    const rows = await prisma.ministry.findMany({
      where,
      orderBy: [{ order: 'asc' }, { name: 'asc' }],
    });
    return rows.map(toMinistry);
  },

  async getBySlug(slug: string) {
    const row = await prisma.ministry.findUnique({ where: { slug } });
    if (!row) throw notFound('Ministry not found.');
    return toMinistry(row);
  },

  async create(input: CreateMinistryInput) {
    const row = await prisma.ministry.create({ data: toData(input) });
    return toMinistry(row);
  },

  async update(slug: string, input: Partial<CreateMinistryInput>) {
    const existing = await prisma.ministry.findUnique({ where: { slug } });
    if (!existing) throw notFound('Ministry not found.');
    const row = await prisma.ministry.update({ where: { slug }, data: toData(input, false) });
    return toMinistry(row);
  },

  async remove(slug: string) {
    const existing = await prisma.ministry.findUnique({ where: { slug } });
    if (!existing) throw notFound('Ministry not found.');
    await prisma.ministry.delete({ where: { slug } });
  },
};

function toData(
  input: Partial<CreateMinistryInput>,
  isCreate = true,
): Prisma.MinistryUncheckedCreateInput {
  const data: Record<string, unknown> = {};
  if (input.name !== undefined) data.name = input.name;
  if (input.slug !== undefined || (isCreate && input.name)) {
    data.slug = input.slug ? slugify(input.slug) : slugify(input.name ?? '');
  }
  if (input.category !== undefined) data.category = input.category;
  if (input.tagline !== undefined) data.tagline = input.tagline;
  if (input.description !== undefined) data.description = input.description;
  if (input.audience !== undefined) data.audience = input.audience;
  if (input.schedule !== undefined) data.schedule = input.schedule;
  if (input.location !== undefined) data.location = input.location;
  if (input.contactEmail !== undefined) data.contactEmail = input.contactEmail || null;
  if (input.image !== undefined) data.image = input.image;
  if (input.ctaLabel !== undefined) data.ctaLabel = input.ctaLabel || null;
  if (input.ctaUrl !== undefined) data.ctaUrl = input.ctaUrl || null;
  if (input.order !== undefined) data.order = input.order;
  return data as Prisma.MinistryUncheckedCreateInput;
}
