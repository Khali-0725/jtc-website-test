/* ============================================================
   prisma/seed.ts — idempotent database seed.
   - Creates an initial SUPER_ADMIN from env (SEED_ADMIN_EMAIL /
     SEED_ADMIN_PASSWORD / SEED_ADMIN_NAME). The password is hashed
     with bcrypt; it is never stored or logged in plaintext.
   - Seeds sample content mirroring the frontend mock data
     (src/data/mock/*) so the live site has parity out of the box.
   All writes use upserts keyed by deterministic ids -> safe to re-run.
   Run with:  npm run prisma:seed   (tsx prisma/seed.ts)
   ============================================================ */
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const ADMIN_EMAIL = (process.env.SEED_ADMIN_EMAIL ?? 'admin@jtccavite.org').toLowerCase();
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD ?? '';
const ADMIN_NAME = process.env.SEED_ADMIN_NAME ?? 'Site Administrator';

async function seedAdmin() {
  if (!ADMIN_PASSWORD || ADMIN_PASSWORD.length < 8) {
    throw new Error(
      'SEED_ADMIN_PASSWORD must be set (>= 8 chars) before seeding. See .env.example.',
    );
  }
  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);
  await prisma.user.upsert({
    where: { email: ADMIN_EMAIL },
    // Do not overwrite an existing admin's password on re-seed.
    update: { name: ADMIN_NAME, role: 'SUPER_ADMIN', isActive: true },
    create: { email: ADMIN_EMAIL, name: ADMIN_NAME, passwordHash, role: 'SUPER_ADMIN' },
  });
  console.log(`Seeded SUPER_ADMIN: ${ADMIN_EMAIL}`);
}

// PLACEHOLDER_CONTENT

const speakers = [
  { id: 'sp-1', name: 'Ptr. Samuel Reyes', role: 'Senior Pastor', slug: 'samuel-reyes', photo: 'placeholder:speaker-1', bio: 'Lead pastor of Jesus The Counselor Cavite, passionate about the full gospel and discipleship.' },
  { id: 'sp-2', name: 'Ptra. Grace Reyes', role: 'Associate Pastor', slug: 'grace-reyes', photo: 'placeholder:speaker-2', bio: 'Oversees prayer and womens ministry with a heart for intercession.' },
  { id: 'sp-3', name: 'Ptr. Daniel Cruz', role: 'Youth & Worship Pastor', slug: 'daniel-cruz', photo: 'placeholder:speaker-3', bio: 'Leads the next generation and worship culture of the house.' },
];

const series = [
  { id: 'se-1', title: 'The Counselor', slug: 'the-counselor', description: 'Discovering the person and work of the Holy Spirit in everyday life.', artwork: 'placeholder:series-1', startDate: new Date('2026-06-07') },
  { id: 'se-2', title: 'Rooted', slug: 'rooted', description: 'Building an unshakable life on the Word of God.', artwork: 'placeholder:series-2', startDate: new Date('2026-04-05') },
  { id: 'se-3', title: 'City on a Hill', slug: 'city-on-a-hill', description: 'Living as light and salt in General Trias and beyond.', artwork: 'placeholder:series-3', startDate: new Date('2026-02-02') },
];

async function seedSpeakersAndSeries() {
  for (const s of speakers) {
    await prisma.speaker.upsert({ where: { id: s.id }, update: s, create: s });
  }
  for (const s of series) {
    await prisma.series.upsert({ where: { id: s.id }, update: s, create: s });
  }
  console.log(`Seeded ${speakers.length} speakers, ${series.length} series`);
}

// PLACEHOLDER_SERMONS

const sermons = [
  { id: 'sm-1', title: 'The Spirit of Counsel', slug: 'the-spirit-of-counsel', description: 'Jesus promised another Helper who would lead us into all truth. In this opening message we explore what it means to walk daily with the Counselor.', speakerName: 'Ptr. Samuel Reyes', speakerId: 'sp-1', seriesTitle: 'The Counselor', seriesId: 'se-1', date: new Date('2026-08-09'), durationMinutes: 47, thumbnail: 'placeholder:sermon-1', videoUrl: null, audioUrl: null, tags: ['Holy Spirit', 'Guidance', 'Full Gospel'], scripture: 'John 14:16-17', featured: true },
  { id: 'sm-2', title: 'Rooted and Established', slug: 'rooted-and-established', description: 'A life rooted in love and the Word withstands every storm. Learn the practices that deepen your spiritual foundation.', speakerName: 'Ptra. Grace Reyes', speakerId: 'sp-2', seriesTitle: 'Rooted', seriesId: 'se-2', date: new Date('2026-08-02'), durationMinutes: 41, thumbnail: 'placeholder:sermon-2', videoUrl: null, audioUrl: null, tags: ['Faith', 'Foundations'], scripture: 'Ephesians 3:17', featured: false },
  { id: 'sm-3', title: 'Light of the City', slug: 'light-of-the-city', description: 'We are called to be a city on a hill. Discover how ordinary believers carry extraordinary light into Cavite.', speakerName: 'Ptr. Daniel Cruz', speakerId: 'sp-3', seriesTitle: 'City on a Hill', seriesId: 'se-3', date: new Date('2026-07-26'), durationMinutes: 38, thumbnail: 'placeholder:sermon-3', videoUrl: null, audioUrl: null, tags: ['Mission', 'Community'], scripture: 'Matthew 5:14', featured: false },
  { id: 'sm-4', title: 'Power to Become', slug: 'power-to-become', description: 'The full gospel declares that we receive power to become children of God.', speakerName: 'Ptr. Samuel Reyes', speakerId: 'sp-1', seriesTitle: 'The Counselor', seriesId: 'se-1', date: new Date('2026-07-19'), durationMinutes: 44, thumbnail: 'placeholder:sermon-4', videoUrl: null, audioUrl: null, tags: ['Identity', 'Grace'], scripture: 'John 1:12', featured: false },
  { id: 'sm-5', title: 'Anchored in the Word', slug: 'anchored-in-the-word', description: 'Scripture is the anchor that holds us steady through every season.', speakerName: 'Ptra. Grace Reyes', speakerId: 'sp-2', seriesTitle: 'Rooted', seriesId: 'se-2', date: new Date('2026-07-12'), durationMinutes: 39, thumbnail: 'placeholder:sermon-5', videoUrl: null, audioUrl: null, tags: ['Scripture', 'Faith'], scripture: 'Hebrews 6:19', featured: false },
  { id: 'sm-6', title: 'Sent Ones', slug: 'sent-ones', description: 'Every follower of Jesus is sent. What does it mean to live sent in your city?', speakerName: 'Ptr. Daniel Cruz', speakerId: 'sp-3', seriesTitle: 'City on a Hill', seriesId: 'se-3', date: new Date('2026-07-05'), durationMinutes: 36, thumbnail: 'placeholder:sermon-6', videoUrl: null, audioUrl: null, tags: ['Mission', 'Discipleship'], scripture: 'John 20:21', featured: false },
  { id: 'sm-7', title: 'The Comforter Comes', slug: 'the-comforter-comes', description: 'When the Holy Spirit comes, He comforts, convicts, and empowers.', speakerName: 'Ptr. Samuel Reyes', speakerId: 'sp-1', seriesTitle: 'The Counselor', seriesId: 'se-1', date: new Date('2026-06-28'), durationMinutes: 49, thumbnail: 'placeholder:sermon-7', videoUrl: null, audioUrl: null, tags: ['Holy Spirit', 'Comfort'], scripture: 'John 16:7', featured: false },
  { id: 'sm-8', title: 'Deep Roots, Real Fruit', slug: 'deep-roots-real-fruit', description: 'Fruitfulness flows from a hidden life of intimacy with God.', speakerName: 'Ptra. Grace Reyes', speakerId: 'sp-2', seriesTitle: 'Rooted', seriesId: 'se-2', date: new Date('2026-06-21'), durationMinutes: 42, thumbnail: 'placeholder:sermon-8', videoUrl: null, audioUrl: null, tags: ['Growth', 'Fruit'], scripture: 'Jeremiah 17:8', featured: false },
  { id: 'sm-9', title: 'For The City', slug: 'for-the-city', description: 'God has planted us in General Trias on purpose and for a purpose.', speakerName: 'Ptr. Daniel Cruz', speakerId: 'sp-3', seriesTitle: 'City on a Hill', seriesId: 'se-3', date: new Date('2026-06-14'), durationMinutes: 35, thumbnail: 'placeholder:sermon-9', videoUrl: null, audioUrl: null, tags: ['Community', 'Purpose'], scripture: 'Jeremiah 29:7', featured: false },
  { id: 'sm-10', title: 'Led by the Spirit', slug: 'led-by-the-spirit', description: 'Those who are led by the Spirit of God are the children of God.', speakerName: 'Ptr. Samuel Reyes', speakerId: 'sp-1', seriesTitle: 'The Counselor', seriesId: 'se-1', date: new Date('2026-06-07'), durationMinutes: 46, thumbnail: 'placeholder:sermon-10', videoUrl: null, audioUrl: null, tags: ['Holy Spirit', 'Guidance'], scripture: 'Romans 8:14', featured: false },
];

async function seedSermons() {
  for (const s of sermons) {
    await prisma.sermon.upsert({ where: { id: s.id }, update: s, create: s });
  }
  console.log(`Seeded ${sermons.length} sermons`);
}

// PLACEHOLDER_EVENTS

const events = [
  { id: 'ev-1', title: 'Encounter Night', slug: 'encounter-night', description: 'An evening of extended worship, prayer, and the presence of God. Come expecting to encounter the Counselor.', category: 'Worship', startDate: new Date('2026-08-22'), endDate: null, time: '6:00 PM', locationName: 'Main Campus', address: '428A, Saint Francis Subdivision, San Juan 1, General Trias, Cavite', image: 'placeholder:event-1', registrationUrl: null, featured: true },
  { id: 'ev-2', title: 'Full Gospel Conference 2026', slug: 'full-gospel-conference-2026', description: 'A three-day conference celebrating the fullness of the gospel with guest speakers, worship, and workshops.', category: 'Conference', startDate: new Date('2026-09-11'), endDate: new Date('2026-09-13'), time: '9:00 AM', locationName: 'Main Campus', address: null, image: 'placeholder:event-2', registrationUrl: null, featured: true },
  { id: 'ev-3', title: 'Community Outreach: General Trias', slug: 'community-outreach-general-trias', description: 'Serving our neighbors with food, prayer, and practical love. Volunteers welcome.', category: 'Outreach', startDate: new Date('2026-08-30'), endDate: null, time: '8:00 AM', locationName: 'General Trias Plaza', address: null, image: 'placeholder:event-3', registrationUrl: null, featured: true },
  { id: 'ev-4', title: 'Youth Fire Friday', slug: 'youth-fire-friday', description: 'High-energy worship, real talk, and community for students.', category: 'Youth', startDate: new Date('2026-08-29'), endDate: null, time: '7:00 PM', locationName: 'Main Campus — Youth Hall', address: null, image: 'placeholder:event-4', registrationUrl: null, featured: false },
  { id: 'ev-5', title: 'Kids Fun Day', slug: 'kids-fun-day', description: 'A morning of games, worship, and Bible adventures for children.', category: 'Kids', startDate: new Date('2026-09-06'), endDate: null, time: '9:00 AM', locationName: 'Main Campus — Kids Wing', address: null, image: 'placeholder:event-5', registrationUrl: null, featured: false },
  { id: 'ev-6', title: 'Night of Prayer & Fasting', slug: 'night-of-prayer-and-fasting', description: 'Contending together for our families, church, and city.', category: 'Prayer', startDate: new Date('2026-09-19'), endDate: null, time: '8:00 PM', locationName: 'Main Campus', address: null, image: 'placeholder:event-6', registrationUrl: null, featured: false },
];

async function seedEvents() {
  for (const e of events) {
    await prisma.event.upsert({ where: { id: e.id }, update: e, create: e });
  }
  console.log(`Seeded ${events.length} events`);
}

// PLACEHOLDER_MINISTRIES

const ministries = [
  { id: 'mn-1', name: 'JTC Kids', slug: 'jtc-kids', category: 'Kids', tagline: 'Where children meet Jesus', description: 'A safe, fun, and Christ-centered environment where kids discover the love of God through worship, stories, and play.', audience: 'Newborn – Grade 6', schedule: 'Sundays, 9:00 AM', location: 'Main Campus — Kids Wing', contactEmail: 'kids@jtccavite.org', image: 'placeholder:ministry-1', order: 1 },
  { id: 'mn-2', name: 'JTC Youth', slug: 'jtc-youth', category: 'Youth', tagline: 'A generation on fire', description: 'Students encounter God, build real friendships, and grow as disciples through worship and small groups.', audience: 'Grades 7 – 12', schedule: 'Fridays, 7:00 PM', location: 'Main Campus — Youth Hall', contactEmail: 'youth@jtccavite.org', image: 'placeholder:ministry-2', order: 2 },
  { id: 'mn-3', name: 'Young Adults', slug: 'young-adults', category: 'Young Adults', tagline: 'Faith for this stage of life', description: 'Community for students and young professionals navigating faith, career, and relationships.', audience: 'Ages 18 – 30', schedule: 'Every other Saturday, 5:00 PM', location: 'Main Campus', contactEmail: 'youngadults@jtccavite.org', image: 'placeholder:ministry-3', order: 3 },
  { id: 'mn-4', name: 'Families & Marriage', slug: 'families-and-marriage', category: 'Families', tagline: 'Building godly homes', description: 'Strengthening marriages and families through the Word and authentic community.', audience: 'Couples & parents', schedule: 'Monthly, 4:00 PM', location: 'Main Campus', contactEmail: null, image: 'placeholder:ministry-4', order: 4 },
  { id: 'mn-5', name: 'Worship & Creative', slug: 'worship-and-creative', category: 'Worship', tagline: 'Lifting a sound in Cavite', description: 'Musicians, singers, and creatives who lead the church into the presence of God with excellence.', audience: 'Auditioned team', schedule: 'Rehearsals: Thursdays, 7:00 PM', location: 'Main Campus — Auditorium', contactEmail: 'worship@jtccavite.org', image: 'placeholder:ministry-5', order: 5 },
  { id: 'mn-6', name: 'Small Groups', slug: 'small-groups', category: 'Small Groups', tagline: 'Life is better together', description: 'Midweek groups across the city where the church becomes family.', audience: 'All ages', schedule: 'Various weeknights', location: 'Homes across General Trias', contactEmail: null, image: 'placeholder:ministry-6', order: 6 },
  { id: 'mn-7', name: 'Prayer & Intercession', slug: 'prayer-and-intercession', category: 'Prayer', tagline: 'The engine room of the house', description: 'A team devoted to prayer for our church, city, and nation.', audience: 'All welcome', schedule: 'Wednesdays before service', location: 'Main Campus — Prayer Room', contactEmail: 'prayer@jtccavite.org', image: 'placeholder:ministry-7', order: 7 },
  { id: 'mn-8', name: 'Outreach & Missions', slug: 'outreach-and-missions', category: 'Outreach', tagline: 'The gospel with feet', description: 'Feeding programs, community care, and missions that reach beyond our walls.', audience: 'Volunteers', schedule: 'Monthly & as scheduled', location: 'Communities around Cavite', contactEmail: null, image: 'placeholder:ministry-8', order: 8 },
  { id: 'mn-9', name: 'Serve Team (Dream Team)', slug: 'serve-team', category: 'Volunteers', tagline: 'Everyone has a place to serve', description: 'Hospitality, ushering, tech, and production — the hands that make Sundays happen.', audience: 'Members', schedule: 'Weekly service rotations', location: 'Main Campus', contactEmail: null, image: 'placeholder:ministry-9', order: 9 },
];

async function seedMinistries() {
  for (const m of ministries) {
    await prisma.ministry.upsert({ where: { id: m.id }, update: m, create: m });
  }
  console.log(`Seeded ${ministries.length} ministries`);
}

// PLACEHOLDER_REST

const staff = [
  { id: 'st-1', name: 'Ptr. Samuel Reyes', role: 'Senior Pastor', photo: 'placeholder:staff-1', order: 1, bio: 'Leads Jesus The Counselor Cavite with his family.' },
  { id: 'st-2', name: 'Ptra. Grace Reyes', role: 'Associate Pastor', photo: 'placeholder:staff-2', order: 2, bio: 'Oversees prayer and womens ministry.' },
  { id: 'st-3', name: 'Ptr. Daniel Cruz', role: 'Youth & Worship Pastor', photo: 'placeholder:staff-3', order: 3, bio: 'Leads the next generation and worship.' },
  { id: 'st-4', name: 'Joanna Lim', role: 'Kids Director', photo: 'placeholder:staff-4', order: 4, bio: 'Shepherds the youngest members of the house.' },
  { id: 'st-5', name: 'Mark Villanueva', role: 'Operations & Serve Team', photo: 'placeholder:staff-5', order: 5, bio: 'Keeps the house running with excellence.' },
  { id: 'st-6', name: 'Ruth Santos', role: 'Outreach Coordinator', photo: 'placeholder:staff-6', order: 6, bio: 'Coordinates missions and community care.' },
];

const announcements = [
  { id: 'an-1', title: 'Water Baptism — September 21', body: 'Ready to take your next step? Sign up for water baptism at the welcome desk.', date: new Date('2026-08-10'), link: '/plan-your-visit', active: true },
  { id: 'an-2', title: 'New Small Groups Launching', body: 'Find your people. New midweek groups are opening across General Trias.', date: new Date('2026-08-05'), link: '/ministries/small-groups', active: true },
  { id: 'an-3', title: 'Serve Team Orientation', body: 'Discover your place on the Dream Team this Sunday after service.', date: new Date('2026-07-28'), link: '/ministries/serve-team', active: true },
];

// Main campus — REAL address + weekly schedule (mirrors siteConfig).
const mainLocation = {
  id: 'loc-main',
  name: 'Jesus The Counselor Cavite — Main Campus',
  slug: 'main-campus',
  isMainCampus: true,
  addressLine: '428A, Saint Francis Subdivision, San Juan 1',
  city: 'City of General Trias',
  region: 'Cavite',
  country: 'Philippines',
  phone: '+63 000 000 0000',
  email: 'hello@jtccavite.org',
  image: 'placeholder:location-1',
  mapEmbedUrl: 'https://www.google.com/maps?q=City%20of%20General%20Trias%2C%20Cavite&output=embed',
  mapLink: 'https://www.google.com/maps/search/?api=1&query=428A+Saint+Francis+Subdivision+San+Juan+1+General+Trias+Cavite',
  serviceTimes: [
    { day: 'Sunday', times: ['9:00 AM'], note: 'Weekend Worship' },
    { day: 'Wednesday', times: ['9:00 AM', '7:00 PM'], note: 'Midweek Service' },
  ],
  parking: 'Free on-site and street parking available near the campus.',
  accessibility: 'Ground-floor access and assistance available on request.',
};

async function seedRest() {
  for (const s of staff) {
    await prisma.staffMember.upsert({ where: { id: s.id }, update: s, create: s });
  }
  for (const a of announcements) {
    await prisma.announcement.upsert({ where: { id: a.id }, update: a, create: a });
  }
  await prisma.location.upsert({
    where: { id: mainLocation.id },
    update: mainLocation,
    create: mainLocation,
  });
  console.log(`Seeded ${staff.length} staff, ${announcements.length} announcements, 1 location`);
}

async function main() {
  await seedAdmin();
  await seedSpeakersAndSeries();
  await seedSermons();
  await seedEvents();
  await seedMinistries();
  await seedRest();
  console.log('Seed complete.');
}

main()
  .catch((err) => {
    console.error('Seed failed:', err);
    process.exit(1);
  })
  .finally(() => {
    void prisma.$disconnect();
  });
