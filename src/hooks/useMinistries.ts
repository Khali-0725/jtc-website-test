import { ministryService } from '@/services/ministryService';
import { useAsync } from './useAsync';

export function useMinistries(category?: string) {
  return useAsync(() => ministryService.list(category), [category]);
}

export function useMinistry(slug: string) {
  return useAsync(() => ministryService.getBySlug(slug), [slug]);
}
