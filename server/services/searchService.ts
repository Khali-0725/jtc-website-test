import { prisma } from '../config/prisma.js';

/* ============================================================
   searchService — global search across published content + static
   pages, returning grouped SearchResult[] (Sermon, Event, Ministry,
   Announcement, Page) exactly as the frontend searchService expects.
   ============================================================ */

export type SearchCategory = 'Sermon' | 'Event' | 'Ministry' | 'Page' | 'Announcement';

export interface SearchResult {
  id: string;
  category: SearchCategory;
  title: string;
  excerpt: string;
  url: string;
}

function truncate(text: string, max = 120): string {
  const clean = text.trim();
  return clean.length <= max ? clean : `${clean.slice(0, max - 1).trimEnd()}…`;
}

const staticPages: SearchResult[] = [
  { id: 'p-about', category: 'Page', title: 'About', excerpt: 'Our story, mission, vision, and beliefs.', url: '/about' },
  { id: 'p-visit', category: 'Page', title: 'Plan Your Visit', excerpt: 'What to expect on your first visit.', url: '/plan-your-visit' },
  { id: 'p-give', category: 'Page', title: 'Give', excerpt: 'Support the mission through generosity.', url: '/give' },
  { id: 'p-watch', category: 'Page', title: 'Watch Online', excerpt: 'Livestream and past messages.', url: '/watch' },
  { id: 'p-contact', category: 'Page', title: 'Contact', excerpt: 'Get in touch with our team.', url: '/contact' },
];

export const searchService = {
  async query(rawTerm: string): Promise<SearchResult[]> {
    const term = rawTerm.trim();
    if (!term) return [];
    const like = { contains: term, mode: 'insensitive' as const };
    const take = 10;

    const [sermons, events, ministries, announcements] = await Promise.all([
      prisma.sermon.findMany({
        where: { published: true, OR: [{ title: like }, { description: like }, { speakerName: like }] },
        take,
      }),
      prisma.event.findMany({
        where: { published: true, OR: [{ title: like }, { description: like }] },
        take,
      }),
      prisma.ministry.findMany({
        where: { OR: [{ name: like }, { description: like }] },
        take,
      }),
      prisma.announcement.findMany({
        where: { active: true, OR: [{ title: like }, { body: like }] },
        take,
      }),
    ]);

    const lower = term.toLowerCase();
    const pages = staticPages.filter((p) =>
      `${p.title} ${p.excerpt}`.toLowerCase().includes(lower),
    );

    return [
      ...sermons.map((s) => ({
        id: s.id,
        category: 'Sermon' as const,
        title: s.title,
        excerpt: truncate(s.description),
        url: `/sermons/${s.slug}`,
      })),
      ...events.map((e) => ({
        id: e.id,
        category: 'Event' as const,
        title: e.title,
        excerpt: truncate(e.description),
        url: `/events/${e.slug}`,
      })),
      ...ministries.map((m) => ({
        id: m.id,
        category: 'Ministry' as const,
        title: m.name,
        excerpt: truncate(m.description),
        url: `/ministries/${m.slug}`,
      })),
      ...announcements.map((a) => ({
        id: a.id,
        category: 'Announcement' as const,
        title: a.title,
        excerpt: truncate(a.body),
        url: a.link ?? '/',
      })),
      ...pages,
    ];
  },
};
