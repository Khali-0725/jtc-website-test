import type { EventCategory, MinistryCategory } from '@/types';

/* ============================================================
   Constants — enumerations, pagination sizes, misc.
   ============================================================ */

export const SERMON_PAGE_SIZE = 9;
export const EVENT_PAGE_SIZE = 9;

export const eventCategories: EventCategory[] = [
  'Worship',
  'Conference',
  'Outreach',
  'Youth',
  'Kids',
  'Prayer',
  'Community',
  'Special',
];

export const ministryCategories: MinistryCategory[] = [
  'Kids',
  'Youth',
  'Young Adults',
  'Families',
  'Worship',
  'Small Groups',
  'Prayer',
  'Outreach',
  'Volunteers',
];

export const givingCategories = [
  { key: 'tithes', label: 'Tithes', blurb: 'Faithful, regular giving as an act of worship.' },
  { key: 'offerings', label: 'Offerings', blurb: 'A generous gift beyond the tithe.' },
  { key: 'missions', label: 'Missions', blurb: 'Taking the gospel beyond our city.' },
  { key: 'outreach', label: 'Outreach', blurb: 'Serving and loving our community.' },
  { key: 'building', label: 'Building & Facilities', blurb: 'Caring for the place we gather.' },
  { key: 'ministry', label: 'Ministry Fund', blurb: 'Fueling the everyday work of the church.' },
] as const;

/* Placeholder-image sentinel. Any mock `image`/`thumbnail` value beginning
   with this prefix renders a branded gradient poster via <Figure>.
   Replace the value with a real URL/path to use a real image. */
export const PLACEHOLDER_PREFIX = 'placeholder:';

/* Deterministic accent hues used to vary placeholder posters. */
export const PLACEHOLDER_HUES = [190, 200, 210, 178, 220, 168];
