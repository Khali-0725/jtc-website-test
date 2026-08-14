import type { Permission, UserRole } from '@/types';
import type { AdminIconName } from './components';

/* ============================================================
   Admin sidebar navigation — self-contained to the admin area.
   Only lists pages that exist as routes (no dead links).
   Visibility is gated by permission and/or explicit roles; the
   AdminLayout filters items against the current user.
   ============================================================ */

export interface AdminNavItem {
  label: string;
  to: string;
  icon: AdminIconName;
  /* Exact-match the route (used for the Dashboard index route). */
  end?: boolean;
  /* Required permission (checked via AuthContext.hasPermission). */
  permission?: Permission;
  /* Optional role allow-list (checked against the user's role). */
  roles?: UserRole[];
}

export interface AdminNavSection {
  heading?: string;
  items: AdminNavItem[];
}

export const adminNavSections: AdminNavSection[] = [
  {
    items: [{ label: 'Dashboard', to: '/admin', icon: 'grid', end: true }],
  },
  {
    heading: 'Content',
    items: [
      { label: 'Sermons', to: '/admin/sermons', icon: 'play', permission: 'content:read' },
      { label: 'Events', to: '/admin/events', icon: 'calendar', permission: 'content:read' },
      { label: 'Ministries', to: '/admin/ministries', icon: 'users', permission: 'content:read' },
      { label: 'Staff', to: '/admin/staff', icon: 'user', permission: 'content:read' },
      {
        label: 'Announcements',
        to: '/admin/announcements',
        icon: 'bell',
        permission: 'content:read',
      },
    ],
  },
  {
    heading: 'Communication',
    items: [
      {
        label: 'Prayer Requests',
        to: '/admin/prayer',
        icon: 'heart',
        permission: 'communication:read',
      },
      { label: 'Messages', to: '/admin/messages', icon: 'mail', permission: 'communication:read' },
    ],
  },
  {
    heading: 'Administration',
    items: [
      {
        label: 'Users',
        to: '/admin/users',
        icon: 'shield',
        roles: ['ADMIN', 'SUPER_ADMIN'],
      },
    ],
  },
];
