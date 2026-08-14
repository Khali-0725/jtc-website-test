import { useState } from 'react';
import { SEO } from '@/components/common/SEO';
import { PageHero } from '@/components/common/PageHero';
import { Container } from '@/components/common/Container';
import { AsyncBoundary } from '@/components/common/AsyncBoundary';
import { AnimatedReveal } from '@/components/common/AnimatedReveal';
import { EmptyState } from '@/components/common/EmptyState';
import { MinistryCard } from '@/components/ministries';
import { useMinistries } from '@/hooks';
import { ministryCategories } from '@/data/constants';
import type { MinistryCategory } from '@/types';
import styles from './Ministries.module.css';

export default function MinistriesPage() {
  const [category, setCategory] = useState<MinistryCategory | ''>('');
  const state = useMinistries(category || undefined);

  return (
    <>
      <SEO
        title="Ministries"
        description="Find your place to belong, grow, and serve at Jesus The Counselor Cavite."
        path="/ministries"
      />
      <PageHero
        eyebrow="Get Involved"
        title="Ministries"
        description="From kids to young adults, worship to outreach — find a community where you can grow in faith and serve with purpose."
      />

      <section className="section">
        <Container size="wide">
          <div className={styles.chips} role="group" aria-label="Filter ministries by category">
            <button
              type="button"
              className={`${styles.chip} ${category === '' ? styles.chipActive : ''}`}
              aria-pressed={category === ''}
              onClick={() => setCategory('')}
            >
              All
            </button>
            {ministryCategories.map((c) => (
              <button
                key={c}
                type="button"
                className={`${styles.chip} ${category === c ? styles.chipActive : ''}`}
                aria-pressed={category === c}
                onClick={() => setCategory(c)}
              >
                {c}
              </button>
            ))}
          </div>

          <div className={styles.results}>
            <AsyncBoundary
              state={state}
              loadingLabel="Loading ministries…"
              empty={
                <EmptyState
                  title="No ministries found"
                  message="There are no ministries in this category yet. Try another filter."
                />
              }
            >
              {(ministries) => (
                <div className={styles.grid}>
                  {ministries.map((m, i) => (
                    <AnimatedReveal key={m.id} delay={(i % 3) * 80}>
                      <MinistryCard ministry={m} />
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
