import type {
  Announcement as PAnnouncement,
  Event as PEvent,
  Location as PLocation,
  Ministry as PMinistry,
  Series as PSeries,
  Sermon as PSermon,
  Speaker as PSpeaker,
  StaffMember as PStaff,
  User as PUser,
} from '@prisma/client';

/* ============================================================
   serializers.ts — map Prisma rows to the EXACT flat shapes the
   frontend services/types expect (src/types/content.ts, auth.ts).
   Nulls become undefined so optional keys are omitted in JSON;
   DateTime columns are emitted as ISO date-only strings.
   ============================================================ */

const orUndef = <T>(v: T | null): T | undefined => (v === null ? undefined : v);
const dateOnly = (d: Date | null): string | undefined =>
  d ? d.toISOString().slice(0, 10) : undefined;

export function toSpeaker(s: PSpeaker) {
  return {
    id: s.id,
    name: s.name,
    role: s.role,
    slug: s.slug,
    photo: orUndef(s.photo),
    bio: orUndef(s.bio),
  };
}

export function toSeries(s: PSeries) {
  return {
    id: s.id,
    title: s.title,
    slug: s.slug,
    description: orUndef(s.description),
    artwork: orUndef(s.artwork),
    startDate: dateOnly(s.startDate),
  };
}

export function toSermon(s: PSermon) {
  return {
    id: s.id,
    title: s.title,
    slug: s.slug,
    description: s.description,
    speaker: s.speakerName,
    speakerId: orUndef(s.speakerId),
    series: orUndef(s.seriesTitle),
    seriesId: orUndef(s.seriesId),
    date: dateOnly(s.date) as string,
    durationMinutes: s.durationMinutes,
    thumbnail: s.thumbnail,
    videoUrl: orUndef(s.videoUrl),
    audioUrl: orUndef(s.audioUrl),
    tags: s.tags,
    scripture: orUndef(s.scripture),
    featured: s.featured,
  };
}

export function toEvent(e: PEvent) {
  return {
    id: e.id,
    title: e.title,
    slug: e.slug,
    description: e.description,
    category: e.category,
    startDate: dateOnly(e.startDate) as string,
    endDate: dateOnly(e.endDate),
    time: e.time,
    locationName: e.locationName,
    address: orUndef(e.address),
    image: e.image,
    registrationUrl: orUndef(e.registrationUrl),
    featured: e.featured,
  };
}

export function toMinistry(m: PMinistry) {
  return {
    id: m.id,
    name: m.name,
    slug: m.slug,
    category: m.category,
    tagline: m.tagline,
    description: m.description,
    audience: m.audience,
    schedule: m.schedule,
    location: m.location,
    contactEmail: orUndef(m.contactEmail),
    image: m.image,
    ctaLabel: orUndef(m.ctaLabel),
    ctaUrl: orUndef(m.ctaUrl),
  };
}

export function toLocation(l: PLocation) {
  return {
    id: l.id,
    name: l.name,
    slug: l.slug,
    isMainCampus: l.isMainCampus,
    addressLine: l.addressLine,
    city: l.city,
    region: l.region,
    country: l.country,
    phone: orUndef(l.phone),
    email: orUndef(l.email),
    image: l.image,
    mapEmbedUrl: orUndef(l.mapEmbedUrl),
    mapLink: orUndef(l.mapLink),
    serviceTimes: (l.serviceTimes as unknown[]) ?? [],
    parking: orUndef(l.parking),
    accessibility: orUndef(l.accessibility),
  };
}

export function toStaff(s: PStaff) {
  return {
    id: s.id,
    name: s.name,
    role: s.role,
    photo: orUndef(s.photo),
    bio: orUndef(s.bio),
    order: s.order,
  };
}

export function toAnnouncement(a: PAnnouncement) {
  return {
    id: a.id,
    title: a.title,
    body: a.body,
    date: dateOnly(a.date) as string,
    link: orUndef(a.link),
  };
}

export function toAuthUser(u: PUser) {
  return { id: u.id, name: u.name, email: u.email, role: u.role };
}

export function toAdminUser(u: PUser) {
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    isActive: u.isActive,
    lastLoginAt: u.lastLoginAt ? u.lastLoginAt.toISOString() : null,
    createdAt: u.createdAt.toISOString(),
    updatedAt: u.updatedAt.toISOString(),
  };
}
