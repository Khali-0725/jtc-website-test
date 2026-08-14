/* ============================================================
   siteConfig — SINGLE SOURCE OF TRUTH for church identity.
   Change church-specific info HERE, never inline in components.
   Values marked [PLACEHOLDER] are safe fictional defaults the
   church can replace; real, confirmed details are marked [REAL].
   ============================================================ */

export const siteConfig = {
  /* --- Identity [REAL] --- */
  name: 'Jesus The Counselor Cavite',
  shortName: 'Jesus The Counselor',
  initials: 'JTC',
  type: 'Christ Centered, Full Gospel Christian Church',
  tagline: 'Worship With Us', // echoes existing "Worship with us every Sunday & Wednesday"
  mission:
    'A Christ centered, full gospel family in Cavite — encountering God, growing in the Word, and reaching our city with the love of Jesus.', // [PLACEHOLDER — refine with church]

  /* --- Main Campus [REAL address + schedule] --- */
  mainCampus: {
    label: 'Main Campus',
    addressLine: '428A, Saint Francis Subdivision, San Juan 1',
    city: 'City of General Trias',
    region: 'Cavite',
    country: 'Philippines',
    fullAddress:
      '428A, Saint Francis Subdivision, San Juan 1, City of General Trias, Cavite, Philippines',
    // [PLACEHOLDER] — replace with the exact Google Maps embed/link for the campus
    mapEmbedUrl:
      'https://www.google.com/maps?q=City%20of%20General%20Trias%2C%20Cavite&output=embed',
    mapLink:
      'https://www.google.com/maps/search/?api=1&query=428A+Saint+Francis+Subdivision+San+Juan+1+General+Trias+Cavite',
  },

  /* --- Weekly worship schedule [REAL] --- */
  serviceTimes: [
    { day: 'Sunday', times: ['9:00 AM'], note: 'Weekend Worship' },
    { day: 'Wednesday', times: ['9:00 AM', '7:00 PM'], note: 'Midweek Service' },
  ],

  /* --- Contact [PLACEHOLDER — confirm before publishing] --- */
  contact: {
    phone: '+63 000 000 0000', // [PLACEHOLDER]
    email: 'hello@jtccavite.org', // [PLACEHOLDER]
    prayerEmail: 'prayer@jtccavite.org', // [PLACEHOLDER]
    officeHours: 'Tuesday – Saturday, 9:00 AM – 5:00 PM', // [PLACEHOLDER]
  },

  /* --- Social [PLACEHOLDER except Facebook, which exists] --- */
  social: {
    facebook: 'https://www.facebook.com/JesusTheCounselorCavite', // [VERIFY exact URL]
    youtube: '', // [PLACEHOLDER]
    instagram: '', // [PLACEHOLDER]
    tiktok: '', // [PLACEHOLDER]
  },

  /* --- Brand [REAL direction] --- */
  brand: {
    logoConcept: 'White dove with a blue cross', // do NOT redesign unless asked
    logoSrc: '/images/logo/jtc-logo.png', // [PLACEHOLDER file — drop the real logo here]
    primaryColorNote: 'Dark/black foundation with electric cyan/blue accent',
  },

  /* --- SEO defaults --- */
  seo: {
    titleTemplate: '%s · Jesus The Counselor Cavite',
    defaultTitle: 'Jesus The Counselor Cavite — Christ Centered, Full Gospel Church',
    defaultDescription:
      'Jesus The Counselor Cavite is a Christ centered, full gospel Christian church in General Trias, Cavite. Join us for worship Sundays 9AM and Wednesdays 9AM & 7PM.',
    siteUrl: import.meta.env.VITE_SITE_URL ?? 'https://jtccavite.org',
    ogImage: '/images/hero/og-default.jpg', // [PLACEHOLDER]
    locale: 'en_PH',
  },
} as const;

export type SiteConfig = typeof siteConfig;
