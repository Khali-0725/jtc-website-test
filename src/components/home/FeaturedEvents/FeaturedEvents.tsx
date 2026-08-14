import { Container } from '@/components/common/Container';
import { SectionHeader } from '@/components/common/SectionHeader';
import { Button } from '@/components/common/Button';
import { AsyncBoundary } from '@/components/common/AsyncBoundary';
import { AnimatedReveal } from '@/components/common/AnimatedReveal';
import { EmptyState } from '@/components/common/EmptyState';
import { EventCard } from '@/components/events/EventCard';
import { useFeaturedEvents } from '@/hooks';
import styles from './FeaturedEvents.module.css';

export function FeaturedEvents() {
  const state = useFeaturedEvents(3);

  return (
    <section className={`section ${styles.wrap}`} aria-labelledby="events-title">
      <Container size="wide">
        <div className={styles.head}>
          <SectionHeader
            eyebrow="What's Happening"
            title="Upcoming events"
            description="Gather, grow, and serve together. Here's what's coming up next."
          />
          <Button to="/events" variant="secondary" className={styles.allBtn}>
            All Events
          </Button>
        </div>

        <AsyncBoundary
          state={state}
          loadingLabel="Loading events…"
          empty={
            <EmptyState
              title="No upcoming events"
              message="Check back soon — new gatherings are added regularly."
            />
          }
        >
          {(events) => (
            <div className={styles.grid}>
              {events.map((event, i) => (
                <AnimatedReveal key={event.id} delay={i * 90}>
                  <EventCard event={event} />
                </AnimatedReveal>
              ))}
            </div>
          )}
        </AsyncBoundary>
      </Container>
    </section>
  );
}
