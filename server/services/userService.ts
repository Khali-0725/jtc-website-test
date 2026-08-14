import type { Prisma } from '@prisma/client';
import { prisma } from '../config/prisma.js';
import { hashPassword } from '../utils/password.js';
import { toAdminUser } from '../models/serializers.js';
import { resolvePagination, listResult } from '../utils/pagination.js';
import { badRequest, conflict, forbidden, notFound } from '../utils/httpError.js';
import type { CreateUserInput, UpdateUserInput, UserListQuery } from '../validators/userSchemas.js';

/* ============================================================
   userService — admin management of back-office users & roles.
   Guards protect the last active SUPER_ADMIN from lockout and
   prevent self-deletion/self-deactivation.
   ============================================================ */

export const userService = {
  async list(query: UserListQuery) {
    const { page, pageSize, skip, take } = resolvePagination(query.page, query.pageSize, 100);
    const where: Prisma.UserWhereInput = {};
    if (query.role) where.role = query.role;
    if (query.isActive !== undefined) where.isActive = query.isActive;

    const [rows, total] = await Promise.all([
      prisma.user.findMany({ where, orderBy: { createdAt: 'asc' }, skip, take }),
      prisma.user.count({ where }),
    ]);
    return listResult(rows.map(toAdminUser), total, { page, pageSize, skip, take });
  },

  async get(id: string) {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) throw notFound('User not found.');
    return toAdminUser(user);
  },

  async create(input: CreateUserInput) {
    const existing = await prisma.user.findUnique({ where: { email: input.email } });
    if (existing) throw conflict('A user with that email already exists.');
    const user = await prisma.user.create({
      data: {
        email: input.email,
        name: input.name,
        passwordHash: await hashPassword(input.password),
        role: input.role,
        isActive: input.isActive,
      },
    });
    return toAdminUser(user);
  },

  async update(id: string, input: UpdateUserInput, actingUserId: string) {
    const target = await prisma.user.findUnique({ where: { id } });
    if (!target) throw notFound('User not found.');

    // Protect the last active SUPER_ADMIN from demotion/deactivation.
    const demoting = input.role !== undefined && input.role !== 'SUPER_ADMIN';
    const deactivating = input.isActive === false;
    if (target.role === 'SUPER_ADMIN' && (demoting || deactivating)) {
      const activeSupers = await prisma.user.count({
        where: { role: 'SUPER_ADMIN', isActive: true },
      });
      if (activeSupers <= 1) {
        throw badRequest('Cannot demote or deactivate the last active super admin.');
      }
    }
    if (id === actingUserId && deactivating) {
      throw badRequest('You cannot deactivate your own account.');
    }

    const data: Prisma.UserUpdateInput = {};
    if (input.name !== undefined) data.name = input.name;
    if (input.role !== undefined) data.role = input.role;
    if (input.isActive !== undefined) data.isActive = input.isActive;
    if (input.password !== undefined) data.passwordHash = await hashPassword(input.password);

    const user = await prisma.user.update({ where: { id }, data });
    return toAdminUser(user);
  },

  async remove(id: string, actingUserId: string) {
    if (id === actingUserId) throw forbidden('You cannot delete your own account.');
    const target = await prisma.user.findUnique({ where: { id } });
    if (!target) throw notFound('User not found.');
    if (target.role === 'SUPER_ADMIN') {
      const supers = await prisma.user.count({ where: { role: 'SUPER_ADMIN' } });
      if (supers <= 1) throw badRequest('Cannot delete the last super admin.');
    }
    await prisma.user.delete({ where: { id } });
  },
};
