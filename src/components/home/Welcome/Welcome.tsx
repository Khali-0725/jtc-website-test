import { Container } from '@/components/common/Container';
import { Button } from '@/components/common/Button';
import { Figure } from '@/components/common/Figure';
import { AnimatedReveal } from '@/components/common/AnimatedReveal';
import { siteConfig } from '@/config/siteConfig';
import styles from './Welcome.module.css';

/* Editorial two-column welcome — copy on the left, branded figure
   on the right. Sets the tone before the content sections. */
export function Welcome() {
  return (
    <section className={`section ${styles.welcome}`} aria-labelledby="welcome-title">
      <Container size="wide">
        <div className={styles.grid}>
          <AnimatedReveal className={styles.copy}>
            <span className="u-eyebrow">
              <span className="accent-bar" aria-hidden="true" />
              Welcome Home
            </span>
            <h2 id="welcome-title" className={styles.title}>
              A place to belong before you believe
            </h2>
            <p className={styles.body}>
              Wherever you are on your journey with God, there's a place for you at{' '}
              {siteConfig.shortName}. We gather each week to worship Jesus, grow in the Word,
              and love our city — as one family.
            </p>
            <p className={styles.body}>
              Come as you are. You'll find warm people, honest teaching, and space to
              encounter God for yourself.
            </p>
            <div className={styles.actions}>
              <Button to="/about" variant="secondary">
                Our Story
              </Button>
              <Button to="/plan-your-visit" variant="ghost">
                What to Expect →
              </Button>
            </div>
          </AnimatedReveal>

          <AnimatedReveal variant="scale" delay={120} className={styles.media}>
            <Figure
              src="placeholder:welcome"
              alt="A gathering of the Jesus The Counselor Cavite family in worship"
              ratio="4/5"
              seed="welcome-worship"
            />
          </AnimatedReveal>
        </div>
      </Container>
    </section>
  );
}
