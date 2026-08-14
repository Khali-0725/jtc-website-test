import type { Prisma } from '@prisma/client';
import { prisma } from '../config/prisma.js';
import { toAnnouncement } from '../models/serializers.js';
import { notFound } from '../utils/httpError.js';
import type { CreateAnnouncementInput } from '../validators/announcementSchemas.js';

/* ============================================================
   announcementService — public reads active-only + admin CRUD.
   ============================================================ */

export const announcementService = {
  async listActive() {
    const rows = await prisma.announcement.findMany({
      where: { active: true },
      orderBy: { date: 'desc' },
    });
    return rows.map(toAnnouncement);
  },

  async listAll() {
    const rows = await prisma.announcement.findMany({ orderBy: { date: 'desc' } });
    return rows.map(toAnnouncement);
  },

  async create(input: CreateAnnouncementInput) {
    const row = await prisma.announcement.create({ data: toData(input) });
    return toAnnouncement(row);
  },

  async update(id: string, input: Partial<CreateAnnouncementInput>) {
    const existing = await prisma.announcement.findUnique({ where: { id } });
    if (!existing) throw notFound('Announcement not found.');
    const row = await prisma.announcement.update({ where: { id }, data: toData(input) });
    return toAnnouncement(row);
  },

  async remove(id: string) {
    const existing = await prisma.announcement.findUnique({ where: { id } });
    if (!existing) throw notFound('Announcement not found.');
    await prisma.announcement.delete({ where: { id } });
  },
};

function toData(
  input: Partial<CreateAnnouncementInput>,
): Prisma.AnnouncementUncheckedCreateInput {
  const data: Record<string, unknown> = {};
  if (input.title !== undefined) data.title = input.title;
  if (input.body !== undefined) data.body = input.body;
  if (input.date !== undefined) data.date = new Date(input.date);
  if (input.link !== undefined) data.link = input.link || null;
  if (input.active !== undefined) data.active = input.active;
  return data as Prisma.AnnouncementUncheckedCreateInput;
}
