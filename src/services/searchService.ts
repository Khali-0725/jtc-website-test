import type { SearchResult } from '@/types';
import { USE_MOCK_DATA, endpoints } from '@/config/apiConfig';
import { api } from './apiClient';
import { sermons } from '@/data/mock/sermons';
import { events } from '@/data/mock/events';
import { ministries } from '@/data/mock/ministries';
import { announcements } from '@/data/mock/announcements';
import { delay } from '@/utils/helpers';
import { truncate } from '@/utils/formatting';

const staticPages: SearchResult[] = [
  { id: 'p-about', category: 'Page', title: 'About', excerpt: 'Our story, mission, vision, and beliefs.', url: '/about' },
  { id: 'p-visit', category: 'Page', title: 'Plan Your Visit', excerpt: 'What to expect on your first visit.', url: '/plan-your-visit' },
  { id: 'p-give', category: 'Page', title: 'Give', excerpt: 'Support the mission through generosity.', url: '/give' },
  { id: 'p-watch', category: 'Page', title: 'Watch Online', excerpt: 'Livestream and past messages.', url: '/watch' },
  { id: 'p-contact', category: 'Page', title: 'Contact', excerpt: 'Get in touch with our team.', url: '/contact' },
];

export const searchService = {
  async query(q: string): Promise<SearchResult[]> {
    if (USE_MOCK_DATA) {
      const term = q.trim().toLowerCase();
      if (!term) return delay([]);
      const results: SearchResult[] = [
        ...sermons
          .filter((s) => `${s.title} ${s.description} ${s.speaker}`.toLowerCase().includes(term))
          .map((s) => ({ id: s.id, category: 'Sermon' as const, title: s.title, excerpt: truncate(s.description, 120), url: `/sermons/${s.slug}` })),
        ...events
          .filter((e) => `${e.title} ${e.description}`.toLowerCase().includes(term))
          .map((e) => ({ id: e.id, category: 'Event' as const, title: e.title, excerpt: truncate(e.description, 120), url: `/events/${e.slug}` })),
        ...ministries
          .filter((m) => `${m.name} ${m.description}`.toLowerCase().includes(term))
          .map((m) => ({ id: m.id, category: 'Ministry' as const, title: m.name, excerpt: truncate(m.description, 120), url: `/ministries/${m.slug}` })),
        ...announcements
          .filter((a) => `${a.title} ${a.body}`.toLowerCase().includes(term))
          .map((a) => ({ id: a.id, category: 'Announcement' as const, title: a.title, excerpt: truncate(a.body, 120), url: a.link ?? '/' })),
        ...staticPages.filter((p) => `${p.title} ${p.excerpt}`.toLowerCase().includes(term)),
      ];
      return delay(results);
    }
    return api.get<SearchResult[]>(endpoints.search, { q });
  },
};
