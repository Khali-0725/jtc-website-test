import { endpoints } from '@/config/apiConfig';
import { api } from './apiClient';

export interface MediaItem {
  id: string;
  url: string;
  filename: string;
  mimeType: string;
  size: number;
  createdAt: string;
}

export const mediaService = {
  list: () => api.get<MediaItem[]>(endpoints.media),
  remove: (id: string) => api.delete<void>(`${endpoints.media}/${id}`),
};
