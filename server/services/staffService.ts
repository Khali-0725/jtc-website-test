import type { Prisma } from '@prisma/client';
import { prisma } from '../config/prisma.js';
import { toStaff } from '../models/serializers.js';
import { notFound } from '../utils/httpError.js';
import type { CreateStaffInput } from '../validators/staffSchemas.js';

/* ============================================================
   staffService — public read (sorted by order) + admin CRUD by id.
   ============================================================ */

export const staffService = {
  async list() {
    const rows = await prisma.staffMember.findMany({
      orderBy: [{ order: 'asc' }, { name: 'asc' }],
    });
    return rows.map(toStaff);
  },

  async create(input: CreateStaffInput) {
    const row = await prisma.staffMember.create({ data: toData(input) });
    return toStaff(row);
  },

  async update(id: string, input: Partial<CreateStaffInput>) {
    const existing = await prisma.staffMember.findUnique({ where: { id } });
    if (!existing) throw notFound('Staff member not found.');
    const row = await prisma.staffMember.update({ where: { id }, data: toData(input) });
    return toStaff(row);
  },

  async remove(id: string) {
    const existing = await prisma.staffMember.findUnique({ where: { id } });
    if (!existing) throw notFound('Staff member not found.');
    await prisma.staffMember.delete({ where: { id } });
  },
};

function toData(input: Partial<CreateStaffInput>): Prisma.StaffMemberUncheckedCreateInput {
  const data: Record<string, unknown> = {};
  if (input.name !== undefined) data.name = input.name;
  if (input.role !== undefined) data.role = input.role;
  if (input.photo !== undefined) data.photo = input.photo || null;
  if (input.bio !== undefined) data.bio = input.bio || null;
  if (input.order !== undefined) data.order = input.order;
  return data as Prisma.StaffMemberUncheckedCreateInput;
}
