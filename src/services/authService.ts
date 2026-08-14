import type { AuthUser, LoginPayload } from '@/types';
import { endpoints } from '@/config/apiConfig';
import { api } from './apiClient';

/* Auth always talks to the real backend (never mocked) so that
   access control is genuine, not simulated. */
export const authService = {
  login: (payload: LoginPayload) => api.post<AuthUser>(endpoints.auth.login, payload),
  logout: () => api.post<void>(endpoints.auth.logout),
  me: () => api.get<AuthUser>(endpoints.auth.me),
  refresh: () => api.post<AuthUser>(endpoints.auth.refresh),
};
