import type { Prisma } from '@prisma/client';
import { prisma } from '../config/prisma.js';
import { toLocation } from '../models/serializers.js';
import { slugify } from '../utils/slug.js';
import { notFound } from '../utils/httpError.js';
import type { CreateLocationInput } from '../validators/locationSchemas.js';

/* ============================================================
   locationService — public reads + admin CRUD.
   serviceTimes is stored/returned as a JSON array of ServiceTime.
   ============================================================ */

export const locationService = {
  async list() {
    const rows = await prisma.location.findMany({
      orderBy: [{ isMainCampus: 'desc' }, { name: 'asc' }],
    });
    return rows.map(toLocation);
  },

  async getMainCampus() {
    const row =
      (await prisma.location.findFirst({ where: { isMainCampus: true } })) ??
      (await prisma.location.findFirst({ orderBy: { name: 'asc' } }));
    if (!row) throw notFound('No campus configured.');
    return toLocation(row);
  },

  async getBySlug(slug: string) {
    const row = await prisma.location.findUnique({ where: { slug } });
    if (!row) throw notFound('Location not found.');
    return toLocation(row);
  },

  async create(input: CreateLocationInput) {
    const row = await prisma.location.create({ data: toData(input) });
    return toLocation(row);
  },

  async update(slug: string, input: Partial<CreateLocationInput>) {
    const existing = await prisma.location.findUnique({ where: { slug } });
    if (!existing) throw notFound('Location not found.');
    const row = await prisma.location.update({ where: { slug }, data: toData(input, false) });
    return toLocation(row);
  },

  async remove(slug: string) {
    const existing = await prisma.location.findUnique({ where: { slug } });
    if (!existing) throw notFound('Location not found.');
    await prisma.location.delete({ where: { slug } });
  },
};

function toData(
  input: Partial<CreateLocationInput>,
  isCreate = true,
): Prisma.LocationUncheckedCreateInput {
  const data: Record<string, unknown> = {};
  if (input.name !== undefined) data.name = input.name;
  if (input.slug !== undefined || (isCreate && input.name)) {
    data.slug = input.slug ? slugify(input.slug) : slugify(input.name ?? '');
  }
  if (input.isMainCampus !== undefined) data.isMainCampus = input.isMainCampus;
  if (input.addressLine !== undefined) data.addressLine = input.addressLine;
  if (input.city !== undefined) data.city = input.city;
  if (input.region !== undefined) data.region = input.region;
  if (input.country !== undefined) data.country = input.country;
  if (input.phone !== undefined) data.phone = input.phone || null;
  if (input.email !== undefined) data.email = input.email || null;
  if (input.image !== undefined) data.image = input.image;
  if (input.mapEmbedUrl !== undefined) data.mapEmbedUrl = input.mapEmbedUrl || null;
  if (input.mapLink !== undefined) data.mapLink = input.mapLink || null;
  if (input.serviceTimes !== undefined) data.serviceTimes = input.serviceTimes;
  if (input.parking !== undefined) data.parking = input.parking || null;
  if (input.accessibility !== undefined) data.accessibility = input.accessibility || null;
  return data as Prisma.LocationUncheckedCreateInput;
}
