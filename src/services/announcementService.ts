import type { Announcement } from '@/types';
import { USE_MOCK_DATA, endpoints } from '@/config/apiConfig';
import { api } from './apiClient';
import { announcements as mockAnnouncements } from '@/data/mock/announcements';
import { delay } from '@/utils/helpers';

/* Create/update payload — mirrors the server's announcement schema.
   `active` controls public visibility (editors can toggle it). */
export interface AnnouncementInput {
  title: string;
  body: string;
  date: string;
  link?: string;
  active?: boolean;
}

export const announcementService = {
  /* Public list = active only. Editors pass ?all=true for the full set. */
  async list(all = false): Promise<Announcement[]> {
    if (USE_MOCK_DATA) return delay(mockAnnouncements);
    return api.get<Announcement[]>(endpoints.announcements, all ? { all: true } : undefined);
  },

  /* --- Admin CRUD (EDITOR and above; server re-validates auth). --- */
  async create(input: AnnouncementInput): Promise<Announcement> {
    if (USE_MOCK_DATA) return delay({ id: `mock-${Date.now()}`, ...input } as Announcement);
    return api.post<Announcement>(endpoints.announcements, input);
  },
  async update(id: string, input: Partial<AnnouncementInput>): Promise<Announcement> {
    if (USE_MOCK_DATA) return delay({ id, title: '', body: '', date: '', ...input } as Announcement);
    return api.put<Announcement>(`${endpoints.announcements}/${id}`, input);
  },
  async remove(id: string): Promise<void> {
    if (USE_MOCK_DATA) {
      await delay(null);
      return;
    }
    return api.delete<void>(`${endpoints.announcements}/${id}`);
  },
};
