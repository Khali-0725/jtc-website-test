import type { Prisma } from '@prisma/client';
import { prisma } from '../config/prisma.js';
import { toSermon, toSeries, toSpeaker } from '../models/serializers.js';
import { resolvePagination, listResult } from '../utils/pagination.js';
import { slugify } from '../utils/slug.js';
import { notFound } from '../utils/httpError.js';
import type { CreateSermonInput, SermonQueryInput } from '../validators/sermonSchemas.js';

/* ============================================================
   sermonService — public reads (published only) + admin CRUD.
   List response is the { items, total, page, pageSize } envelope.
   ============================================================ */

export const sermonService = {
  async list(query: SermonQueryInput) {
    const { page, pageSize, skip, take } = resolvePagination(query.page, query.pageSize, 100);
    const where: Prisma.SermonWhereInput = { published: true };

    if (query.search) {
      const q = query.search;
      where.OR = [
        { title: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
        { speakerName: { contains: q, mode: 'insensitive' } },
        { scripture: { contains: q, mode: 'insensitive' } },
      ];
    }
    if (query.speaker) where.speakerName = query.speaker;
    if (query.series) where.seriesTitle = query.series;
    if (query.tag) where.tags = { has: query.tag };

    const [rows, total] = await Promise.all([
      prisma.sermon.findMany({ where, orderBy: { date: 'desc' }, skip, take }),
      prisma.sermon.count({ where }),
    ]);

    return listResult(rows.map(toSermon), total, { page, pageSize, skip, take });
  },

  async getBySlug(slug: string) {
    const row = await prisma.sermon.findFirst({ where: { slug, published: true } });
    if (!row) throw notFound('Sermon not found.');
    return toSermon(row);
  },

  async getFeatured() {
    const row =
      (await prisma.sermon.findFirst({
        where: { published: true, featured: true },
        orderBy: { date: 'desc' },
      })) ??
      (await prisma.sermon.findFirst({ where: { published: true }, orderBy: { date: 'desc' } }));
    if (!row) throw notFound('No sermons available.');
    return toSermon(row);
  },

  async listSeries() {
    const rows = await prisma.series.findMany({ orderBy: { startDate: 'desc' } });
    return rows.map(toSeries);
  },

  async listSpeakers() {
    const rows = await prisma.speaker.findMany({ orderBy: { name: 'asc' } });
    return rows.map(toSpeaker);
  },

  async create(input: CreateSermonInput) {
    const row = await prisma.sermon.create({ data: toData(input) });
    return toSermon(row);
  },

  async update(slug: string, input: Partial<CreateSermonInput>) {
    const existing = await prisma.sermon.findUnique({ where: { slug } });
    if (!existing) throw notFound('Sermon not found.');
    const row = await prisma.sermon.update({ where: { slug }, data: toData(input, false) });
    return toSermon(row);
  },

  async remove(slug: string) {
    const existing = await prisma.sermon.findUnique({ where: { slug } });
    if (!existing) throw notFound('Sermon not found.');
    await prisma.sermon.delete({ where: { slug } });
  },
};

/* Map the flat API input to Prisma columns (denormalizing speaker/series). */
function toData(input: Partial<CreateSermonInput>, isCreate = true): Prisma.SermonUncheckedCreateInput {
  const data: Record<string, unknown> = {};
  if (input.title !== undefined) data.title = input.title;
  if (input.slug !== undefined || (isCreate && input.title)) {
    data.slug = input.slug ? slugify(input.slug) : slugify(input.title ?? '');
  }
  if (input.description !== undefined) data.description = input.description;
  if (input.speaker !== undefined) data.speakerName = input.speaker;
  if (input.speakerId !== undefined) data.speakerId = input.speakerId || null;
  if (input.series !== undefined) data.seriesTitle = input.series || null;
  if (input.seriesId !== undefined) data.seriesId = input.seriesId || null;
  if (input.date !== undefined) data.date = new Date(input.date);
  if (input.durationMinutes !== undefined) data.durationMinutes = input.durationMinutes;
  if (input.thumbnail !== undefined) data.thumbnail = input.thumbnail;
  if (input.videoUrl !== undefined) data.videoUrl = input.videoUrl || null;
  if (input.audioUrl !== undefined) data.audioUrl = input.audioUrl || null;
  if (input.tags !== undefined) data.tags = input.tags;
  if (input.scripture !== undefined) data.scripture = input.scripture || null;
  if (input.featured !== undefined) data.featured = input.featured;
  if (input.published !== undefined) data.published = input.published;
  return data as Prisma.SermonUncheckedCreateInput;
}
