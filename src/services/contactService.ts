import { USE_MOCK_DATA, endpoints } from '@/config/apiConfig';
import { api } from './apiClient';
import { delay } from '@/utils/helpers';

export interface ContactMessageInput {
  name: string;
  email: string;
  subject: string;
  message: string;
  website?: string; // honeypot
}

/* Serialized contact message as returned to Staff+ reviewers. */
export interface ContactMessageRecord {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  handled: boolean;
  handledById: string | null;
  handledAt: string | null;
  createdAt: string;
}

export interface ContactListQuery {
  handled?: boolean;
  page?: number;
  pageSize?: number;
}

export interface ContactListResult {
  items: ContactMessageRecord[];
  total: number;
  page: number;
  pageSize: number;
}

export const contactService = {
  async submit(input: ContactMessageInput): Promise<{ ok: true }> {
    if (USE_MOCK_DATA) return delay({ ok: true } as const, 600);
    return api.post<{ ok: true }>(endpoints.contact, input);
  },

  /* --- Staff+ review (server enforces requireStaff). --- */
  async list(query: ContactListQuery = {}): Promise<ContactListResult> {
    if (USE_MOCK_DATA) {
      return delay({ items: [], total: 0, page: query.page ?? 1, pageSize: query.pageSize ?? 20 });
    }
    return api.get<ContactListResult>(endpoints.contact, { ...query });
  },
  async setHandled(id: string, handled: boolean): Promise<ContactMessageRecord | { ok: true }> {
    if (USE_MOCK_DATA) return delay({ ok: true } as const);
    return api.patch<ContactMessageRecord>(`${endpoints.contact}/${id}/handled`, { handled });
  },
};
