import type { Ministry } from '@/types';
import { USE_MOCK_DATA, endpoints } from '@/config/apiConfig';
import { api } from './apiClient';
import { ministries as mockMinistries } from '@/data/mock/ministries';
import { delay } from '@/utils/helpers';

/* Create/update payload — mirrors the server's ministry schema. */
export interface MinistryInput {
  name: string;
  slug?: string;
  category: Ministry['category'];
  tagline: string;
  description: string;
  audience: string;
  schedule: string;
  location: string;
  contactEmail?: string;
  image: string;
  ctaLabel?: string;
  ctaUrl?: string;
  order?: number;
}

export const ministryService = {
  async list(category?: string): Promise<Ministry[]> {
    if (USE_MOCK_DATA) {
      const list = category
        ? mockMinistries.filter((m) => m.category === category)
        : mockMinistries;
      return delay(list);
    }
    return api.get<Ministry[]>(endpoints.ministries, { category });
  },
  async getBySlug(slug: string): Promise<Ministry | null> {
    if (USE_MOCK_DATA) return delay(mockMinistries.find((m) => m.slug === slug) ?? null);
    return api.get<Ministry>(`${endpoints.ministries}/${slug}`);
  },

  /* --- Admin CRUD (EDITOR and above; server re-validates auth). --- */
  async create(input: MinistryInput): Promise<Ministry> {
    if (USE_MOCK_DATA) return delay({ id: `mock-${Date.now()}`, ...input } as unknown as Ministry);
    return api.post<Ministry>(endpoints.ministries, input);
  },
  async update(slug: string, input: Partial<MinistryInput>): Promise<Ministry> {
    if (USE_MOCK_DATA)
      return delay({ id: `mock-${Date.now()}`, slug, ...input } as unknown as Ministry);
    return api.put<Ministry>(`${endpoints.ministries}/${slug}`, input);
  },
  async remove(slug: string): Promise<void> {
    if (USE_MOCK_DATA) {
      await delay(null);
      return;
    }
    return api.delete<void>(`${endpoints.ministries}/${slug}`);
  },
};
