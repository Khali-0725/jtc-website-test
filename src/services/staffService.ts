import type { StaffMember } from '@/types';
import { USE_MOCK_DATA, endpoints } from '@/config/apiConfig';
import { api } from './apiClient';
import { staff as mockStaff } from '@/data/mock/staff';
import { delay } from '@/utils/helpers';

/* Create/update payload — mirrors the server's staff schema. */
export interface StaffInput {
  name: string;
  role: string;
  photo?: string;
  bio?: string;
  order?: number;
}

export const staffService = {
  async list(): Promise<StaffMember[]> {
    if (USE_MOCK_DATA)
      return delay([...mockStaff].sort((a, b) => (a.order ?? 99) - (b.order ?? 99)));
    return api.get<StaffMember[]>(endpoints.staff);
  },

  /* --- Admin CRUD (EDITOR and above; server re-validates auth). --- */
  async create(input: StaffInput): Promise<StaffMember> {
    if (USE_MOCK_DATA) return delay({ id: `mock-${Date.now()}`, ...input } as StaffMember);
    return api.post<StaffMember>(endpoints.staff, input);
  },
  async update(id: string, input: Partial<StaffInput>): Promise<StaffMember> {
    if (USE_MOCK_DATA) return delay({ id, name: '', role: '', ...input } as StaffMember);
    return api.put<StaffMember>(`${endpoints.staff}/${id}`, input);
  },
  async remove(id: string): Promise<void> {
    if (USE_MOCK_DATA) {
      await delay(null);
      return;
    }
    return api.delete<void>(`${endpoints.staff}/${id}`);
  },
};
