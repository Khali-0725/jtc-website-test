import { Helmet } from 'react-helmet-async';
import { siteConfig } from '@/config/siteConfig';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  path?: string;
  type?: 'website' | 'article' | 'video.other';
  noindex?: boolean;
  jsonLd?: Record<string, unknown>;
}

export function SEO({ title, description, image, path, type = 'website', noindex, jsonLd }: SEOProps) {
  const fullTitle = title
    ? siteConfig.seo.titleTemplate.replace('%s', title)
    : siteConfig.seo.defaultTitle;
  const desc = description ?? siteConfig.seo.defaultDescription;
  const url = `${siteConfig.seo.siteUrl}${path ?? ''}`;
  const ogImage = `${siteConfig.seo.siteUrl}${image ?? siteConfig.seo.ogImage}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <link rel="canonical" href={url} />
      {noindex && <meta name="robots" content="noindex,nofollow" />}

      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:locale" content={siteConfig.seo.locale} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
      <meta name="twitter:image" content={ogImage} />

      {jsonLd && <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>}
    </Helmet>
  );
}
