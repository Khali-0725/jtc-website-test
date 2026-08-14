import { SEO } from '@/components/common/SEO';
import { PageHero } from '@/components/common/PageHero';
import { Container } from '@/components/common/Container';
import { Button } from '@/components/common/Button';
import { SectionHeader } from '@/components/common/SectionHeader';
import { AnimatedReveal } from '@/components/common/AnimatedReveal';
import { siteConfig } from '@/config/siteConfig';
import styles from './PlanYourVisit.module.css';

/* [PLACEHOLDER] first-time guest guidance — warm, generic copy the
   church can personalize. */
const EXPECT = [
  {
    title: 'When you arrive',
    body: 'Look for our welcome team near the entrance. They will help you find your way, answer questions, and point you to a seat.',
  },
  {
    title: 'What to wear',
    body: 'Come as you are. Most people dress casually or smart-casual — there is no dress code, just come comfortable.',
  },
  {
    title: 'Your kids',
    body: 'Children are always welcome. Let a team member know and we will help you get your kids settled and cared for.',
  },
  {
    title: 'How long',
    body: 'A typical service runs around 90 minutes of worship, teaching, and prayer. Stay afterward for coffee and conversation.',
  },
];

export default function PlanYourVisitPage() {
  const { serviceTimes, mainCampus } = siteConfig;

  return (
    <>
      <SEO
        title="Plan Your Visit"
        description={`Planning your first visit to ${siteConfig.name}? Here is what to expect, when we gather, and how to find us in ${mainCampus.city}, ${mainCampus.region}.`}
        path="/plan-your-visit"
      />
      <PageHero
        eyebrow="Plan Your Visit"
        title="What to Expect"
        description="Thinking about joining us for the first time? We would love to save you a seat. Here is everything you need to feel right at home."
      />

      {/* --- Service Times band --- */}
      <section className={`section ${styles.timesBand}`} aria-labelledby="visit-times">
        <Container size="wide">
          <div className={styles.timesHead}>
            <span className="u-eyebrow">
              <span className="accent-bar" aria-hidden="true" />
              Gather With Us
            </span>
            <h2 id="visit-times" className={styles.timesTitle}>
              Weekly worship at our {mainCampus.label}
            </h2>
          </div>
          <ul className={styles.times} role="list">
            {serviceTimes.map((s, i) => (
              <AnimatedReveal as="li" key={s.day} delay={i * 90} className={styles.timeCard}>
                {s.note && <span className={styles.timeNote}>{s.note}</span>}
                <span className={styles.timeDay}>{s.day}</span>
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
        </Container>
      </section>

      {/* --- What to Expect grid --- */}
      <section className="section">
        <Container size="wide">
          <SectionHeader
            eyebrow="Your First Visit"
            title="What to expect"
            description="No pressure, no awkward moments — just a warm welcome from our church family."
          />
          <div className={styles.expectGrid}>
            {EXPECT.map((item, i) => (
              <AnimatedReveal as="article" key={item.title} delay={(i % 4) * 80} className={styles.expectCard}>
                <span className={styles.expectMarker} aria-hidden="true" />
                <h3 className={styles.expectTitle}>{item.title}</h3>
                <p className={styles.expectBody}>{item.body}</p>
              </AnimatedReveal>
            ))}
          </div>
        </Container>
      </section>

      {/* --- Getting Here --- */}
      <section className={`section ${styles.gettingBand}`}>
        <Container size="wide">
          <div className={styles.getting}>
            <AnimatedReveal className={styles.gettingText}>
              <SectionHeader eyebrow="Getting Here" title="Finding our campus" />
              <address className={styles.gettingAddress}>{mainCampus.fullAddress}</address>
              <p className={styles.gettingNote}>
                Free on-site and street parking is available nearby. If you need directions or a
                hand when you arrive, our team will be watching for you.
              </p>
              <div className={styles.gettingActions}>
                <Button href={mainCampus.mapLink} external>
                  Get Directions
                </Button>
                <Button to="/locations" variant="outline">
                  View Campus Details
                </Button>
              </div>
            </AnimatedReveal>
          </div>
        </Container>
      </section>

      {/* --- Closing CTA --- */}
      <section className={`section ${styles.ctaBand}`}>
        <Container size="narrow">
          <AnimatedReveal className={styles.cta}>
            <h2 className={styles.ctaTitle}>We can&apos;t wait to meet you</h2>
            <p className={styles.ctaText}>
              Have a question before you come, or want us to know you are on your way? Reach out —
              we would love to hear from you.
            </p>
            <div className={styles.ctaActions}>
              <Button to="/contact" size="lg">
                Contact Us
              </Button>
              <Button to="/give" variant="outline" size="lg">
                Give
              </Button>
            </div>
          </AnimatedReveal>
        </Container>
      </section>
    </>
  );
}
