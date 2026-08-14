import { Container } from '@/components/common/Container';
import { SectionHeader } from '@/components/common/SectionHeader';
import { Button } from '@/components/common/Button';
import { AsyncBoundary } from '@/components/common/AsyncBoundary';
import { AnimatedReveal } from '@/components/common/AnimatedReveal';
import { MinistryCard } from '@/components/ministries/MinistryCard';
import { useMinistries } from '@/hooks';
import styles from './MinistriesPreview.module.css';

export function MinistriesPreview() {
  const state = useMinistries();

  return (
    <section className={`section ${styles.wrap}`} aria-labelledby="ministries-title">
      <div className={styles.bg} aria-hidden="true" />
      <Container size="wide">
        <SectionHeader
          eyebrow="Get Involved"
          title="Find your people"
          description="From kids to young adults to families — there's a place for every season of life."
          align="center"
        />

        <AsyncBoundary state={state} loadingLabel="Loading ministries…">
          {(ministries) => (
            <>
              <div className={styles.grid}>
                {ministries.slice(0, 6).map((m, i) => (
                  <AnimatedReveal key={m.id} variant="scale" delay={i * 70}>
                    <MinistryCard ministry={m} />
                  </AnimatedReveal>
                ))}
              </div>
              <div className={styles.cta}>
                <Button to="/ministries" size="lg">
                  Explore All Ministries
                </Button>
              </div>
            </>
          )}
        </AsyncBoundary>
      </Container>
    </section>
  );
}
