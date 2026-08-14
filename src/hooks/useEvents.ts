import { eventService, type EventQuery } from '@/services/eventService';
import { useAsync } from './useAsync';

export function useEvents(query: EventQuery = {}) {
  return useAsync(() => eventService.list(query), [JSON.stringify(query)]);
}

export function useFeaturedEvents(limit = 3) {
  return useAsync(() => eventService.getFeatured(limit), [limit]);
}

export function useEvent(slug: string) {
  return useAsync(() => eventService.getBySlug(slug), [slug]);
}
