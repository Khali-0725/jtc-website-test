import { useParams, Link } from 'react-router-dom';
import { SEO } from '@/components/common/SEO';
import { Container } from '@/components/common/Container';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Card';
import { Figure } from '@/components/common/Figure';
import { AsyncBoundary } from '@/components/common/AsyncBoundary';
import { EmptyState } from '@/components/common/EmptyState';
import { useEvent } from '@/hooks';
import { formatDate } from '@/utils';
import { siteConfig } from '@/config/siteConfig';
import styles from './EventDetails.module.css';

export default function EventDetailsPage() {
  const { slug = '' } = useParams();
  const state = useEvent(slug);

  return (
    <article className={styles.page}>
      <AsyncBoundary
        state={state}
        loadingLabel="Loading event…"
        empty={
          <Container size="narrow">
            <div className={styles.missing}>
              <EmptyState title="Event not found" message="This event may have ended, moved, or been removed." />
              <Button to="/events" variant="outline">
                Back to Events
              </Button>
            </div>
          </Container>
        }
      >
        {(event) => {
          const address = event.address ?? siteConfig.mainCampus.fullAddress;
          return (
            <>
              <SEO
                title={event.title}
                description={event.description}
                path={`/events/${event.slug}`}
                type="article"
                image={event.image}
              />

              <Container size="wide" className={styles.head}>
                <Link to="/events" className={styles.back}>
                  ← All Events
                </Link>
                <Badge>{event.category}</Badge>
                <h1 className={styles.title}>{event.title}</h1>
                <p className={styles.meta}>
                  {formatDate(event.startDate)} · {event.time} · {event.locationName}
                </p>
              </Container>

              <Container size="wide">
                <div className={styles.media}>
                  <Figure src={event.image} alt={event.title} ratio="16/9" seed={event.slug} eager />
                </div>
              </Container>

              <Container size="narrow" className={styles.body}>
                <p className={styles.description}>{event.description}</p>

                <div className={styles.details}>
                  <h2 className={styles.detailsTitle}>Location</h2>
                  <p className={styles.location}>{event.locationName}</p>
                  <address className={styles.address}>{address}</address>
                </div>

                <div className={styles.actions}>
                  {event.registrationUrl && (
                    <Button href={event.registrationUrl} external variant="primary">
                      Register
                    </Button>
                  )}
                  <Button href={siteConfig.mainCampus.mapLink} external variant="outline">
                    View on Map
                  </Button>
                  <Button to="/events" variant="ghost">
                    More Events →
                  </Button>
                </div>
              </Container>
            </>
          );
        }}
      </AsyncBoundary>
    </article>
  );
}
