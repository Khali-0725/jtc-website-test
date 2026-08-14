import type { Sermon, SermonSeries, Speaker } from '@/types';
import { USE_MOCK_DATA, endpoints } from '@/config/apiConfig';
import { api } from './apiClient';
import { sermons as mockSermons } from '@/data/mock/sermons';
import { series as mockSeries } from '@/data/mock/series';
import { speakers as mockSpeakers } from '@/data/mock/speakers';
import { delay } from '@/utils/helpers';

export interface SermonQuery {
  search?: string;
  speaker?: string;
  series?: string;
  tag?: string;
  page?: number;
  pageSize?: number;
}

export interface SermonListResult {
  items: Sermon[];
  total: number;
  page: number;
  pageSize: number;
}

/* Create/update payload — mirrors the server's sermon schema.
   `slug` is optional (server derives it from the title when omitted). */
export interface SermonInput {
  title: string;
  slug?: string;
  description: string;
  speaker: string;
  speakerId?: string;
  series?: string;
  seriesId?: string;
  date: string;
  durationMinutes: number;
  thumbnail: string;
  videoUrl?: string;
  audioUrl?: string;
  tags: string[];
  scripture?: string;
  featured?: boolean;
  published?: boolean;
}

function filterMock(query: SermonQuery): SermonListResult {
  const { search, speaker, series, tag, page = 1, pageSize = 9 } = query;
  let list = [...mockSermons].sort((a, b) => +new Date(b.date) - +new Date(a.date));
  if (search) {
    const q = search.toLowerCase();
    list = list.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.speaker.toLowerCase().includes(q) ||
        (s.scripture ?? '').toLowerCase().includes(q),
    );
  }
  if (speaker) list = list.filter((s) => s.speaker === speaker);
  if (series) list = list.filter((s) => s.series === series);
  if (tag) list = list.filter((s) => s.tags.includes(tag));
  const total = list.length;
  const start = (page - 1) * pageSize;
  return { items: list.slice(start, start + pageSize), total, page, pageSize };
}

export const sermonService = {
  async list(query: SermonQuery = {}): Promise<SermonListResult> {
    if (USE_MOCK_DATA) return delay(filterMock(query));
    return api.get<SermonListResult>(endpoints.sermons, { ...query });
  },
  async getBySlug(slug: string): Promise<Sermon | null> {
    if (USE_MOCK_DATA) return delay(mockSermons.find((s) => s.slug === slug) ?? null);
    return api.get<Sermon>(`${endpoints.sermons}/${slug}`);
  },
  async getFeatured(): Promise<Sermon | null> {
    if (USE_MOCK_DATA)
      return delay(mockSermons.find((s) => s.featured) ?? mockSermons[0] ?? null);
    return api.get<Sermon>(`${endpoints.sermons}/featured`);
  },
  async getSeries(): Promise<SermonSeries[]> {
    if (USE_MOCK_DATA) return delay(mockSeries);
    return api.get<SermonSeries[]>(endpoints.series);
  },
  async getSpeakers(): Promise<Speaker[]> {
    if (USE_MOCK_DATA) return delay(mockSpeakers);
    return api.get<Speaker[]>('/speakers');
  },

  /* --- Admin CRUD (EDITOR and above; server re-validates auth). --- */
  async create(input: SermonInput): Promise<Sermon> {
    if (USE_MOCK_DATA) return delay({ id: `mock-${Date.now()}`, ...input } as unknown as Sermon);
    return api.post<Sermon>(endpoints.sermons, input);
  },
  async update(slug: string, input: Partial<SermonInput>): Promise<Sermon> {
    if (USE_MOCK_DATA) return delay({ id: `mock-${Date.now()}`, slug, ...input } as unknown as Sermon);
    return api.put<Sermon>(`${endpoints.sermons}/${slug}`, input);
  },
  async remove(slug: string): Promise<void> {
    if (USE_MOCK_DATA) {
      await delay(null);
      return;
    }
    return api.delete<void>(`${endpoints.sermons}/${slug}`);
  },
};
