import type { UserRole } from '@/types';
import { USE_MOCK_DATA, endpoints } from '@/config/apiConfig';
import { api } from './apiClient';
import { delay } from '@/utils/helpers';

/* ============================================================
   userService — ADMIN/SUPER_ADMIN management of back-office users.
   The API never returns password hashes; AdminUser is the safe,
   serialized shape (see server/models/serializers.toAdminUser).
   ============================================================ */

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UserListQuery {
  role?: UserRole;
  isActive?: boolean;
  page?: number;
  pageSize?: number;
}

export interface UserListResult {
  items: AdminUser[];
  total: number;
  page: number;
  pageSize: number;
}

export interface CreateUserInput {
  email: string;
  name: string;
  password: string;
  role: UserRole;
  isActive?: boolean;
}

export interface UpdateUserInput {
  name?: string;
  password?: string;
  role?: UserRole;
  isActive?: boolean;
}

export const userService = {
  async list(query: UserListQuery = {}): Promise<UserListResult> {
    if (USE_MOCK_DATA) {
      return delay({ items: [], total: 0, page: query.page ?? 1, pageSize: query.pageSize ?? 20 });
    }
    return api.get<UserListResult>(endpoints.users, { ...query });
  },
  async create(input: CreateUserInput): Promise<AdminUser> {
    if (USE_MOCK_DATA) {
      const { password: _password, ...rest } = input;
      return delay({
        id: `mock-${Date.now()}`,
        isActive: input.isActive ?? true,
        lastLoginAt: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...rest,
      } as AdminUser);
    }
    return api.post<AdminUser>(endpoints.users, input);
  },
  async update(id: string, input: UpdateUserInput): Promise<AdminUser> {
    if (USE_MOCK_DATA) {
      const { password: _password, ...rest } = input;
      return delay({ id, ...rest } as AdminUser);
    }
    return api.put<AdminUser>(`${endpoints.users}/${id}`, input);
  },
  async remove(id: string): Promise<void> {
    if (USE_MOCK_DATA) {
      await delay(null);
      return;
    }
    return api.delete<void>(`${endpoints.users}/${id}`);
  },
};
