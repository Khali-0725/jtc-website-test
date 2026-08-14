import type { Location } from '@/types';
import { USE_MOCK_DATA, endpoints } from '@/config/apiConfig';
import { api } from './apiClient';
import { locations as mockLocations } from '@/data/mock/locations';
import { delay } from '@/utils/helpers';

export const locationService = {
  async list(): Promise<Location[]> {
    if (USE_MOCK_DATA) return delay(mockLocations);
    return api.get<Location[]>(endpoints.locations);
  },
  async getMainCampus(): Promise<Location | null> {
    if (USE_MOCK_DATA)
      return delay(mockLocations.find((l) => l.isMainCampus) ?? mockLocations[0] ?? null);
    return api.get<Location>(`${endpoints.locations}/main`);
  },
  async getBySlug(slug: string): Promise<Location | null> {
    if (USE_MOCK_DATA) return delay(mockLocations.find((l) => l.slug === slug) ?? null);
    return api.get<Location>(`${endpoints.locations}/${slug}`);
  },
};
