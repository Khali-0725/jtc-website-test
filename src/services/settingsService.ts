import type { SiteSettings } from '@/types';
import { USE_MOCK_DATA, endpoints } from '@/config/apiConfig';
import { api } from './apiClient';
import { delay } from '@/utils/helpers';

/* ============================================================
   settingsService — read/update the SiteSettings singleton.
   Public GET; the PUT is re-validated as SUPER_ADMIN on the server.
   In mock mode the value lives in memory for the session so the
   admin Branding page still works before the backend is live.
   ============================================================ */

/* Update payload — all optional; an empty string clears a field. */
export interface SettingsInput {
  logoUrl?: string;
  heroImageUrl?: string;
  pageHeaderImageUrl?: string;
  ogImageUrl?: string;
  accentColor?: string;
}

let mockSettings: SiteSettings = {};

export const settingsService = {
  async get(): Promise<SiteSettings> {
    if (USE_MOCK_DATA) return delay({ ...mockSettings });
    return api.get<SiteSettings>(endpoints.settings);
  },

  async update(input: SettingsInput): Promise<SiteSettings> {
    if (USE_MOCK_DATA) {
      // Mirror the server: empty string clears the value.
      const next: SiteSettings = { ...mockSettings };
      (Object.keys(input) as (keyof SettingsInput)[]).forEach((k) => {
        const v = input[k];
        if (v) next[k] = v;
        else delete next[k];
      });
      mockSettings = next;
      return delay({ ...mockSettings });
    }
    return api.put<SiteSettings>(endpoints.settings, input);
  },
};
