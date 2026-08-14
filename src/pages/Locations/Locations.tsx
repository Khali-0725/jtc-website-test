import { SEO } from '@/components/common/SEO';
import { PageHero } from '@/components/common/PageHero';
import { Container } from '@/components/common/Container';
import { Button } from '@/components/common/Button';
import { AsyncBoundary } from '@/components/common/AsyncBoundary';
import { AnimatedReveal } from '@/components/common/AnimatedReveal';
import { EmptyState } from '@/components/common/EmptyState';
import { useAsync } from '@/hooks';
import { locationService } from '@/services/locationService';
import { siteConfig } from '@/config/siteConfig';
import type { Location } from '@/types';
import styles from './Locations.module.css';

function LocationCard({ location, index }: { location: Location; index: number }) {
  const fullAddress = [location.addressLine, location.city, location.region, location.country]
    .filter(Boolean)
    .join(', ');
  const mapEmbedUrl = location.mapEmbedUrl || siteConfig.mainCampus.mapEmbedUrl;
  const mapLink = location.mapLink || siteConfig.mainCampus.mapLink;

  return (
    <AnimatedReveal as="article" delay={index * 90} className={styles.card}>
      <div className={styles.info}>
        {location.isMainCampus && <span className={styles.tag}>Main Campus</span>}
        <h2 className={styles.name}>{location.name}</h2>
        <address className={styles.address}>{fullAddress}</address>

        <div className={styles.times}>
          <h3 className={styles.blockLabel}>Service Times</h3>
          <ul className={styles.timeList} role="list">
            {location.serviceTimes.map((s) => (
              <li key={s.day} className={styles.timeRow}>
                <span className={styles.day}>{s.day}</span>
                <span className={styles.slots}>
                  {s.times.map((t) => (
                    <span key={t} className={styles.slot}>
                      {t}
                    </span>
                  ))}
                </span>
                {s.note && <span className={styles.note}>{s.note}</span>}
              </li>
            ))}
          </ul>
        </div>

        {(location.parking || location.accessibility) && (
          <div className={styles.notes}>
            {location.parking && (
              <div className={styles.noteBlock}>
                <h3 className={styles.blockLabel}>Parking</h3>
                <p>{location.parking}</p>
              </div>
            )}
            {location.accessibility && (
              <div className={styles.noteBlock}>
                <h3 className={styles.blockLabel}>Accessibility</h3>
                <p>{location.accessibility}</p>
              </div>
            )}
          </div>
        )}

        <div className={styles.actions}>
          {mapLink && (
            <Button href={mapLink} external>
              Get Directions
            </Button>
          )}
          <Button to="/plan-your-visit" variant="outline">
            Plan Your Visit
          </Button>
        </div>
      </div>

      {mapEmbedUrl && (
        <div className={styles.mapWrap}>
          <iframe
            className={styles.map}
            src={mapEmbedUrl}
            title={`Map to ${location.name}`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            style={{ border: 0 }}
            allowFullScreen
          />
        </div>
      )}
    </AnimatedReveal>
  );
}

export default function LocationsPage() {
  const state = useAsync(() => locationService.list(), []);

  return (
    <>
      <SEO
        title="Locations"
        description={`Find ${siteConfig.name} and plan your visit to our ${siteConfig.mainCampus.label} in ${siteConfig.mainCampus.city}, ${siteConfig.mainCampus.region}.`}
        path="/locations"
      />
      <PageHero
        eyebrow="Visit Us"
        title="Our Campus"
        description={`We gather in ${siteConfig.mainCampus.city}, ${siteConfig.mainCampus.region}. Here is everything you need to find us and join a service.`}
      />

      <section className="section">
        <Container size="wide">
          <AsyncBoundary
            state={state}
            loadingLabel="Loading locations…"
            empty={
              <EmptyState
                title="Location details coming soon"
                message="Campus information will be published here shortly."
              />
            }
          >
            {(locations) => (
              <div className={styles.list}>
                {locations.map((loc, i) => (
                  <LocationCard key={loc.id} location={loc} index={i} />
                ))}
              </div>
            )}
          </AsyncBoundary>
        </Container>
      </section>
    </>
  );
}
