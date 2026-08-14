import { sermonService, type SermonQuery } from '@/services/sermonService';
import { useAsync } from './useAsync';

export function useSermons(query: SermonQuery = {}) {
  return useAsync(() => sermonService.list(query), [JSON.stringify(query)]);
}

export function useFeaturedSermon() {
  return useAsync(() => sermonService.getFeatured(), []);
}

export function useSermon(slug: string) {
  return useAsync(() => sermonService.getBySlug(slug), [slug]);
}

export function useSermonFilters() {
  const speakers = useAsync(() => sermonService.getSpeakers(), []);
  const series = useAsync(() => sermonService.getSeries(), []);
  return { speakers, series };
}
