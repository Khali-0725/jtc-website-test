import type { Location } from '@/types';
import { siteConfig } from '@/config/siteConfig';

/* Main Campus uses REAL address + schedule from siteConfig. */
export const locations: Location[] = [
  {
    id: 'loc-main',
    name: 'Jesus The Counselor Cavite — Main Campus',
    slug: 'main-campus',
    isMainCampus: true,
    addressLine: siteConfig.mainCampus.addressLine,
    city: siteConfig.mainCampus.city,
    region: siteConfig.mainCampus.region,
    country: siteConfig.mainCampus.country,
    phone: siteConfig.contact.phone,
    email: siteConfig.contact.email,
    image: 'placeholder:location-1',
    mapEmbedUrl: siteConfig.mainCampus.mapEmbedUrl,
    mapLink: siteConfig.mainCampus.mapLink,
    serviceTimes: [...siteConfig.serviceTimes],
    parking: 'Free on-site and street parking available near the campus.', // [PLACEHOLDER]
    accessibility: 'Ground-floor access and assistance available on request.', // [PLACEHOLDER]
  },
];
