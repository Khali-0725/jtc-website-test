import { SEO } from '@/components/common/SEO';
import { PageHero } from '@/components/common/PageHero';
import { Container } from '@/components/common/Container';
import { Button } from '@/components/common/Button';
import { Figure } from '@/components/common/Figure';
import { SectionHeader } from '@/components/common/SectionHeader';
import { AsyncBoundary } from '@/components/common/AsyncBoundary';
import { AnimatedReveal } from '@/components/common/AnimatedReveal';
import { EmptyState } from '@/components/common/EmptyState';
import { useAsync } from '@/hooks';
import { staffService } from '@/services/staffService';
import { siteConfig } from '@/config/siteConfig';
import styles from './About.module.css';

/* [PLACEHOLDER] belief statements — generic, full-gospel wording the
   church can refine. Rendered under #beliefs. */
const BELIEFS = [
  {
    title: 'The Bible',
    body: 'We believe the Scriptures are the inspired Word of God — our final authority for faith, life, and everything we teach.',
  },
  {
    title: 'God',
    body: 'We believe in one God, eternally existing as Father, Son, and Holy Spirit — perfect in love, holiness, and power.',
  },
  {
    title: 'Jesus',
    body: 'We believe Jesus is the Son of God, fully God and fully man, who died for our sins, rose again, and is coming back.',
  },
  {
    title: 'Salvation',
    body: 'We believe salvation is a gift of grace received through faith in Jesus alone — freely offered to everyone who believes.',
  },
  {
    title: 'The Holy Spirit',
    body: 'We believe the Holy Spirit empowers, gifts, and transforms every believer to live and serve like Jesus today.',
  },
  {
    title: 'The Church',
    body: 'We believe the Church is a family on mission — gathered to worship, grow together, and reach our city with the love of Christ.',
  },
];

export default function AboutPage() {
  const staff = useAsync(() => staffService.list(), []);

  return (
    <>
      <SEO title="About" description={siteConfig.mission} path="/about" />
      <PageHero eyebrow="Our Church" title="Our Story" description={siteConfig.mission} />

      {/* --- Our Story: two-column editorial text + image --- */}
      <section className="section">
        <Container size="wide">
          <div className={styles.story}>
            <AnimatedReveal className={styles.storyText}>
              <SectionHeader
                eyebrow="Who We Are"
                title={`A Christ centered family in ${siteConfig.mainCampus.region}`}
              />
              <p>
                {siteConfig.shortName} began with a simple longing — to see people in{' '}
                {siteConfig.mainCampus.city} encounter the living God and find their place in His
                family. We are a Christ centered, full gospel church where every song, message, and
                gathering points back to Jesus.
              </p>
              <p>
                Week by week we make room for honest worship, the teaching of the Word, and the
                work of the Holy Spirit. Whether you have followed Jesus for decades or are simply
                curious, there is a seat and a welcome waiting for you here.
              </p>
              <p>
                Our heart reaches beyond our walls. We long to serve our neighbors, strengthen
                families, and carry the hope of the gospel across our city and beyond.
              </p>
            </AnimatedReveal>
            <AnimatedReveal variant="scale" delay={120} className={styles.storyMedia}>
              <Figure src="placeholder:about-story" alt={`Worship at ${siteConfig.name}`} ratio="4/5" />
            </AnimatedReveal>
          </div>
        </Container>
      </section>

      {/* --- What We Believe --- */}
      <section id="beliefs" className={`section ${styles.beliefsBand}`}>
        <Container size="wide">
          <SectionHeader
            eyebrow="What We Believe"
            title="The truths we build our lives on"
            description="A simple summary of the historic Christian faith that shapes everything we do."
            align="center"
          />
          <div className={styles.beliefGrid}>
            {BELIEFS.map((b, i) => (
              <AnimatedReveal as="article" key={b.title} delay={(i % 3) * 80} className={styles.beliefCard}>
                <span className={styles.beliefMarker} aria-hidden="true" />
                <h3 className={styles.beliefTitle}>{b.title}</h3>
                <p className={styles.beliefBody}>{b.body}</p>
              </AnimatedReveal>
            ))}
          </div>
        </Container>
      </section>

      {/* --- Leadership --- */}
      <section id="leadership" className="section">
        <Container size="wide">
          <SectionHeader
            eyebrow="Our Team"
            title="Leadership"
            description="Meet some of the people who serve and shepherd our church family."
          />
          <AsyncBoundary
            state={staff}
            loadingLabel="Loading leadership…"
            empty={<EmptyState title="Team coming soon" message="Our leadership profiles will be shared here shortly." />}
          >
            {(members) => (
              <div className={styles.leaderGrid}>
                {members.map((m, i) => (
                  <AnimatedReveal as="article" key={m.id} delay={(i % 3) * 80} className={styles.leaderCard}>
                    <Figure src={m.photo} alt={m.name} ratio="4/5" seed={m.id} />
                    <div className={styles.leaderBody}>
                      <h3 className={styles.leaderName}>{m.name}</h3>
                      <p className={styles.leaderRole}>{m.role}</p>
                      {m.bio && <p className={styles.leaderBio}>{m.bio}</p>}
                    </div>
                  </AnimatedReveal>
                ))}
              </div>
            )}
          </AsyncBoundary>
        </Container>
      </section>

      {/* --- Closing CTA --- */}
      <section className={`section ${styles.ctaBand}`}>
        <Container size="narrow">
          <AnimatedReveal className={styles.cta}>
            <h2 className={styles.ctaTitle}>Come and see for yourself</h2>
            <p className={styles.ctaText}>
              The best way to get to know us is to join us. We would love to meet you this week.
            </p>
            <div className={styles.ctaActions}>
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
    </>
  );
}
