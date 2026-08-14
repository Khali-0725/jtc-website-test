import type { UserRole, Permission } from '@/types';

/* ============================================================
   Navigation — primary/secondary nav + admin nav + footer.
   Centralized so header, mobile menu, and footer stay in sync.
   ============================================================ */

export interface NavItem {
  label: string;
  to: string;
}

/* Primary desktop nav (center) */
export const primaryNav: NavItem[] = [
  { label: 'Home', to: '/' },
  { label: 'Sermons', to: '/sermons' },
  { label: 'Events', to: '/events' },
  { label: 'Ministries', to: '/ministries' },
  { label: 'About', to: '/about' },
  { label: 'Locations', to: '/locations' },
];

/* Secondary actions (right side / mobile) */
export const secondaryNav: NavItem[] = [
  { label: 'Plan Your Visit', to: '/plan-your-visit' },
  { label: 'Watch Live', to: '/watch' },
];

export const primaryCta: NavItem = { label: 'Give', to: '/give' };

/* Footer link columns */
export const footerNav: { heading: string; items: NavItem[] }[] = [
  {
    heading: 'Explore',
    items: [
      { label: 'Sermons', to: '/sermons' },
      { label: 'Events', to: '/events' },
      { label: 'Ministries', to: '/ministries' },
      { label: 'Watch Online', to: '/watch' },
    ],
  },
  {
    heading: 'Connect',
    items: [
      { label: 'Plan Your Visit', to: '/plan-your-visit' },
      { label: 'Locations', to: '/locations' },
      { label: 'Prayer Request', to: '/prayer' },
      { label: 'Contact', to: '/contact' },
    ],
  },
  {
    heading: 'About',
    items: [
      { label: 'Our Story', to: '/about' },
      { label: 'What We Believe', to: '/about#beliefs' },
      { label: 'Leadership', to: '/about#leadership' },
      { label: 'Give', to: '/give' },
    ],
  },
];

/* --- Admin navigation (grouped) --- */
export interface AdminNavItem extends NavItem {
  icon?: string;
  permission?: Permission;
}
export interface AdminNavGroup {
  heading?: string;
  items: AdminNavItem[];
}

export const adminNav: AdminNavGroup[] = [
  { items: [{ label: 'Dashboard', to: '/admin', icon: 'grid' }] },
  {
    heading: 'Content',
    items: [
      { label: 'Sermons', to: '/admin/sermons', icon: 'play', permission: 'content:write' },
      { label: 'Sermon Series', to: '/admin/series', icon: 'layers', permission: 'content:write' },
      { label: 'Events', to: '/admin/events', icon: 'calendar', permission: 'content:write' },
      { label: 'Ministries', to: '/admin/ministries', icon: 'users', permission: 'content:write' },
      { label: 'Locations', to: '/admin/locations', icon: 'pin', permission: 'content:write' },
      { label: 'Staff', to: '/admin/staff', icon: 'user', permission: 'content:write' },
      { label: 'Announcements', to: '/admin/announcements', icon: 'bell', permission: 'content:write' },
      { label: 'Pages', to: '/admin/pages', icon: 'file', permission: 'content:write' },
    ],
  },
  {
    heading: 'Communication',
    items: [
      { label: 'Prayer Requests', to: '/admin/prayer', icon: 'heart', permission: 'communication:read' },
      { label: 'Contact Messages', to: '/admin/messages', icon: 'mail', permission: 'communication:read' },
    ],
  },
  {
    heading: 'Media',
    items: [{ label: 'Media Library', to: '/admin/media', icon: 'image', permission: 'content:write' }],
  },
  {
    heading: 'Settings',
    items: [
      { label: 'Church Information', to: '/admin/settings/church', icon: 'info', permission: 'settings:write' },
      { label: 'Social Media', to: '/admin/settings/social', icon: 'share', permission: 'settings:write' },
      { label: 'Website Settings', to: '/admin/settings/site', icon: 'settings', permission: 'settings:write' },
    ],
  },
];

/* --- Role -> permission matrix (frontend gate; server re-validates) --- */
export const rolePermissions: Record<UserRole, Permission[]> = {
  STAFF: ['content:read', 'communication:read'],
  EDITOR: ['content:read', 'content:write', 'communication:read'],
  ADMIN: [
    'content:read',
    'content:write',
    'content:delete',
    'communication:read',
    'users:read',
    'users:write',
  ],
  SUPER_ADMIN: [
    'content:read',
    'content:write',
    'content:delete',
    'communication:read',
    'users:read',
    'users:write',
    'settings:write',
  ],
};
