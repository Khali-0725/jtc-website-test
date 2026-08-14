/* API configuration — base URL + endpoint map.
   Client talks to the Express backend via these paths. */

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api';

export const endpoints = {
  auth: {
    login: '/auth/login',
    logout: '/auth/logout',
    me: '/auth/me',
    refresh: '/auth/refresh',
  },
  sermons: '/sermons',
  series: '/series',
  events: '/events',
  ministries: '/ministries',
  locations: '/locations',
  staff: '/staff',
  announcements: '/announcements',
  prayer: '/prayer',
  contact: '/contact',
  users: '/users',
  media: '/media',
  settings: '/settings',
  search: '/search',
} as const;

/* Feature flag: when true, services read bundled mock data instead of
   calling the API. Lets the frontend run standalone before the backend
   is deployed. Flip to false once the API is live. */
export const USE_MOCK_DATA =
  (import.meta.env.VITE_USE_MOCK_DATA ?? 'true') !== 'false';
