import { Container } from '@/components/common/Container';
import { Button } from '@/components/common/Button';
import { AnimatedReveal } from '@/components/common/AnimatedReveal';
import { siteConfig } from '@/config/siteConfig';
import styles from './ServiceTimes.module.css';

/* Weekly rhythm band — service times pulled from siteConfig
   (single source of truth) plus the campus address. */
export function ServiceTimes() {
  const { serviceTimes, mainCampus } = siteConfig;

  return (
    <section className={`section ${styles.wrap}`} aria-labelledby="times-title">
      <div className={styles.bg} aria-hidden="true" />
      <Container size="wide">
        <div className={styles.head}>
          <span className="u-eyebrow">
            <span className="accent-bar" aria-hidden="true" />
            Gather With Us
          </span>
          <h2 id="times-title" className={styles.title}>
            Weekly worship at our {mainCampus.label}
          </h2>
        </div>

        <ul className={styles.times} role="list">
          {serviceTimes.map((s, i) => (
            <AnimatedReveal as="li" key={s.day} delay={i * 90} className={styles.card}>
              {s.note && <span className={styles.note}>{s.note}</span>}
              <span className={styles.day}>{s.day}</span>
              <span className={styles.slots}>
                {s.times.map((t) => (
                  <span key={t} className={styles.slot}>
                    {t}
                  </span>
                ))}
              </span>
            </AnimatedReveal>
          ))}
        </ul>

        <div className={styles.footer}>
          <address className={styles.address}>{mainCampus.fullAddress}</address>
          <div className={styles.actions}>
            <Button to="/locations" variant="secondary">
              Get Directions
            </Button>
            <Button to="/plan-your-visit" variant="ghost">
              Plan Your Visit →
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
