import { SEO } from '@/components/common/SEO';
import {
  Hero,
  Welcome,
  ServiceTimes,
  LatestSermon,
  FeaturedEvents,
  MinistriesPreview,
  VisitCTA,
} from '@/components/home';
import { siteConfig } from '@/config/siteConfig';

export default function HomePage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Church',
    name: siteConfig.name,
    description: siteConfig.mission,
    address: {
      '@type': 'PostalAddress',
      streetAddress: siteConfig.mainCampus.addressLine,
      addressLocality: siteConfig.mainCampus.city,
      addressRegion: siteConfig.mainCampus.region,
      addressCountry: siteConfig.mainCampus.country,
    },
    url: siteConfig.seo.siteUrl,
  };

  return (
    <>
      <SEO
        title="Home"
        description={siteConfig.mission}
        path="/"
        jsonLd={jsonLd}
      />
      <Hero />
      <Welcome />
      <ServiceTimes />
      <LatestSermon />
      <FeaturedEvents />
      <MinistriesPreview />
      <VisitCTA />
    </>
  );
}
