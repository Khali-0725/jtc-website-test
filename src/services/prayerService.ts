import { USE_MOCK_DATA, endpoints } from '@/config/apiConfig';
import { api } from './apiClient';
import { delay } from '@/utils/helpers';

export interface PrayerRequestInput {
  name: string;
  email: string;
  request: string;
  anonymous: boolean;
  /* Honeypot field — must stay empty (spam bots fill it). */
  website?: string;
}

/* Serialized prayer request as returned to Staff+ reviewers.
   `email` is null when the submitter chose to remain anonymous. */
export interface PrayerRequestRecord {
  id: string;
  name: string;
  email: string | null;
  request: string;
  anonymous: boolean;
  handled: boolean;
  handledById: string | null;
  handledAt: string | null;
  createdAt: string;
}

export interface PrayerListQuery {
  handled?: boolean;
  page?: number;
  pageSize?: number;
}

export interface PrayerListResult {
  items: PrayerRequestRecord[];
  total: number;
  page: number;
  pageSize: number;
}

export const prayerService = {
  async submit(input: PrayerRequestInput): Promise<{ ok: true }> {
    if (USE_MOCK_DATA) {
      // Simulate spam rejection via honeypot even in mock mode.
      if (input.website) return delay({ ok: true } as const, 400);
      return delay({ ok: true } as const, 600);
    }
    return api.post<{ ok: true }>(endpoints.prayer, input);
  },

  /* --- Staff+ review (server enforces requireStaff). --- */
  async list(query: PrayerListQuery = {}): Promise<PrayerListResult> {
    if (USE_MOCK_DATA) {
      return delay({ items: [], total: 0, page: query.page ?? 1, pageSize: query.pageSize ?? 20 });
    }
    return api.get<PrayerListResult>(endpoints.prayer, { ...query });
  },
  async setHandled(id: string, handled: boolean): Promise<PrayerRequestRecord | { ok: true }> {
    if (USE_MOCK_DATA) return delay({ ok: true } as const);
    return api.patch<PrayerRequestRecord>(`${endpoints.prayer}/${id}/handled`, { handled });
  },
};
