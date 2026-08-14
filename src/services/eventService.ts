import type { ChurchEvent } from '@/types';
import { USE_MOCK_DATA, endpoints } from '@/config/apiConfig';
import { api } from './apiClient';
import { events as mockEvents } from '@/data/mock/events';
import { delay } from '@/utils/helpers';
import { isUpcoming } from '@/utils/dates';

export interface EventQuery {
  category?: string;
  search?: string;
  page?: number;
  pageSize?: number;
  upcomingOnly?: boolean;
}

export interface EventListResult {
  items: ChurchEvent[];
  total: number;
  page: number;
  pageSize: number;
}

/* Create/update payload — mirrors the server's event schema. */
export interface EventInput {
  title: string;
  slug?: string;
  description: string;
  category: ChurchEvent['category'];
  startDate: string;
  endDate?: string;
  time: string;
  locationName: string;
  address?: string;
  image: string;
  registrationUrl?: string;
  featured?: boolean;
  published?: boolean;
}

export const eventService = {
  async list(query: EventQuery = {}): Promise<EventListResult> {
    if (USE_MOCK_DATA) {
      const { category, search, page = 1, pageSize = 9, upcomingOnly } = query;
      let list = [...mockEvents].sort((a, b) => +new Date(a.startDate) - +new Date(b.startDate));
      if (upcomingOnly) list = list.filter((e) => isUpcoming(e.startDate));
      if (category) list = list.filter((e) => e.category === category);
      if (search) {
        const q = search.toLowerCase();
        list = list.filter(
          (e) => e.title.toLowerCase().includes(q) || e.description.toLowerCase().includes(q),
        );
      }
      const total = list.length;
      const start = (page - 1) * pageSize;
      return delay({ items: list.slice(start, start + pageSize), total, page, pageSize });
    }
    return api.get<EventListResult>(endpoints.events, { ...query });
  },
  async getFeatured(limit = 3): Promise<ChurchEvent[]> {
    if (USE_MOCK_DATA) {
      const featured = mockEvents.filter((e) => e.featured).slice(0, limit);
      return delay(featured.length ? featured : mockEvents.slice(0, limit));
    }
    return api.get<ChurchEvent[]>(`${endpoints.events}/featured`, { limit });
  },
  async getBySlug(slug: string): Promise<ChurchEvent | null> {
    if (USE_MOCK_DATA) return delay(mockEvents.find((e) => e.slug === slug) ?? null);
    return api.get<ChurchEvent>(`${endpoints.events}/${slug}`);
  },

  /* --- Admin CRUD (EDITOR and above; server re-validates auth). --- */
  async create(input: EventInput): Promise<ChurchEvent> {
    if (USE_MOCK_DATA) return delay({ id: `mock-${Date.now()}`, ...input } as unknown as ChurchEvent);
    return api.post<ChurchEvent>(endpoints.events, input);
  },
  async update(slug: string, input: Partial<EventInput>): Promise<ChurchEvent> {
    if (USE_MOCK_DATA)
      return delay({ id: `mock-${Date.now()}`, slug, ...input } as unknown as ChurchEvent);
    return api.put<ChurchEvent>(`${endpoints.events}/${slug}`, input);
  },
  async remove(slug: string): Promise<void> {
    if (USE_MOCK_DATA) {
      await delay(null);
      return;
    }
    return api.delete<void>(`${endpoints.events}/${slug}`);
  },
};
