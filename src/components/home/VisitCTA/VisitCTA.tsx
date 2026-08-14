import { Container } from '@/components/common/Container';
import { Button } from '@/components/common/Button';
import { AnimatedReveal } from '@/components/common/AnimatedReveal';
import { siteConfig } from '@/config/siteConfig';
import styles from './VisitCTA.module.css';

/* Closing call-to-action band inviting first-time guests. */
export function VisitCTA() {
  return (
    <section className={styles.wrap} aria-labelledby="visit-cta-title">
      <div className={styles.stage} aria-hidden="true">
        <div className={styles.glow} />
      </div>
      <Container size="narrow">
        <AnimatedReveal className={styles.inner}>
          <span className="u-eyebrow" style={{ justifyContent: 'center' }}>
            <span className="accent-bar" aria-hidden="true" />
            Plan Your First Visit
          </span>
          <h2 id="visit-cta-title" className={styles.title}>
            We'd love to meet you this week
          </h2>
          <p className={styles.lead}>
            New to {siteConfig.shortName}? Let us know you're coming and we'll help you know
            exactly what to expect — where to park, where to go, and how to get connected.
          </p>
          <div className={styles.actions}>
            <Button to="/plan-your-visit" size="lg">
              Plan Your Visit
            </Button>
            <Button to="/contact" variant="outline" size="lg">
              Get in Touch
            </Button>
          </div>
        </AnimatedReveal>
      </Container>
    </section>
  );
}
