import { useMemo, useState } from 'react';
import { SEO } from '@/components/common/SEO';
import { PageHero } from '@/components/common/PageHero';
import { Container } from '@/components/common/Container';
import { AsyncBoundary } from '@/components/common/AsyncBoundary';
import { AnimatedReveal } from '@/components/common/AnimatedReveal';
import { EmptyState } from '@/components/common/EmptyState';
import { Button } from '@/components/common/Button';
import { EventCard } from '@/components/events/EventCard';
import { useEvents } from '@/hooks';
import { eventCategories } from '@/data/constants';
import { classNames } from '@/utils/helpers';
import styles from './Events.module.css';

export default function EventsPage() {
  const [category, setCategory] = useState('');
  const query = useMemo(() => ({ category: category || undefined, upcomingOnly: true }), [category]);
  const state = useEvents(query);

  return (
    <>
      <SEO title="Events" description="Upcoming events and gatherings at Jesus The Counselor Cavite." path="/events" />
      <PageHero
        eyebrow="What's Happening"
        title="Events"
        description="Find your next opportunity to gather, grow, and serve with our church family."
      />

      <section className="section">
        <Container size="wide">
          <div className={styles.filters} role="group" aria-label="Filter events by category">
            <button
              className={classNames(styles.chip, !category && styles.active)}
              onClick={() => setCategory('')}
            >
              All
            </button>
            {eventCategories.map((c) => (
              <button
                key={c}
                className={classNames(styles.chip, category === c && styles.active)}
                onClick={() => setCategory(c)}
              >
                {c}
              </button>
            ))}
          </div>

          <div className={styles.results}>
            <AsyncBoundary
              state={state}
              loadingLabel="Loading events…"
              empty={
                <EmptyState
                  title="No upcoming events"
                  message="There are no events in this category right now. Check back soon."
                  action={
                    <Button variant="outline" size="sm" onClick={() => setCategory('')}>
                      View all events
                    </Button>
                  }
                />
              }
            >
              {(result) => (
                <div className={styles.grid}>
                  {result.items.map((event, i) => (
                    <AnimatedReveal key={event.id} delay={(i % 3) * 80}>
                      <EventCard event={event} />
                    </AnimatedReveal>
                  ))}
                </div>
              )}
            </AsyncBoundary>
          </div>
        </Container>
      </section>
    </>
  );
}
