/* ============================================================
   Domain content types — shared by frontend, services, admin.
   These mirror the Prisma models on the server.
   ============================================================ */

export type ID = string;

export interface Speaker {
  id: ID;
  name: string;
  role: string;
  slug: string;
  photo?: string;
  bio?: string;
}

export interface SermonSeries {
  id: ID;
  title: string;
  slug: string;
  description?: string;
  artwork?: string;
  startDate?: string;
}

export interface Sermon {
  id: ID;
  title: string;
  slug: string;
  description: string;
  speaker: string;
  speakerId?: ID;
  series?: string;
  seriesId?: ID;
  date: string; // ISO
  durationMinutes: number;
  thumbnail: string;
  videoUrl?: string;
  audioUrl?: string;
  tags: string[];
  scripture?: string;
  featured?: boolean;
}

export type EventCategory =
  | 'Worship'
  | 'Conference'
  | 'Outreach'
  | 'Youth'
  | 'Kids'
  | 'Prayer'
  | 'Community'
  | 'Special';

export interface ChurchEvent {
  id: ID;
  title: string;
  slug: string;
  description: string;
  category: EventCategory;
  startDate: string; // ISO
  endDate?: string;
  time: string; // human readable, e.g. "9:00 AM"
  locationName: string;
  address?: string;
  image: string;
  registrationUrl?: string;
  featured?: boolean;
}

export type MinistryCategory =
  | 'Kids'
  | 'Youth'
  | 'Young Adults'
  | 'Families'
  | 'Worship'
  | 'Small Groups'
  | 'Prayer'
  | 'Outreach'
  | 'Volunteers';

export interface Ministry {
  id: ID;
  name: string;
  slug: string;
  category: MinistryCategory;
  tagline: string;
  description: string;
  audience: string;
  schedule: string;
  location: string;
  contactEmail?: string;
  image: string;
  ctaLabel?: string;
  ctaUrl?: string;
}

export interface Location {
  id: ID;
  name: string;
  slug: string;
  isMainCampus: boolean;
  addressLine: string;
  city: string;
  region: string;
  country: string;
  phone?: string;
  email?: string;
  image: string;
  mapEmbedUrl?: string;
  mapLink?: string;
  serviceTimes: ServiceTime[];
  parking?: string;
  accessibility?: string;
}

export interface ServiceTime {
  day: string;
  times: string[];
  note?: string;
}

export interface StaffMember {
  id: ID;
  name: string;
  role: string;
  photo?: string;
  bio?: string;
  order?: number;
}

export interface Announcement {
  id: ID;
  title: string;
  body: string;
  date: string;
  link?: string;
}

/* --- Async request state used across hooks/components --- */
export type RequestStatus = 'idle' | 'loading' | 'success' | 'empty' | 'error';

export interface AsyncState<T> {
  data: T | null;
  status: RequestStatus;
  error: string | null;
}

/* --- Global search --- */
export type SearchCategory = 'Sermon' | 'Event' | 'Ministry' | 'Page' | 'Announcement';

export interface SearchResult {
  id: ID;
  category: SearchCategory;
  title: string;
  excerpt: string;
  url: string;
}
