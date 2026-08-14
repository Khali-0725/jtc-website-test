export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'EDITOR' | 'STAFF';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface LoginPayload {
  email: string;
  password: string;
}

/* Permission matrix keys used by the admin UI (backend re-validates). */
export type Permission =
  | 'content:read'
  | 'content:write'
  | 'content:delete'
  | 'users:read'
  | 'users:write'
  | 'settings:write'
  | 'communication:read';
