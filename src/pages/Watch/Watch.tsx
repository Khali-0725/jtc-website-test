import { SEO } from '@/components/common/SEO';
import { PageHero } from '@/components/common/PageHero';
import { Container } from '@/components/common/Container';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Card';
import { VideoPlayer } from '@/components/common/VideoPlayer';
import { AsyncBoundary } from '@/components/common/AsyncBoundary';
import { AnimatedReveal } from '@/components/common/AnimatedReveal';
import { useFeaturedSermon } from '@/hooks';
import { formatShortDate, formatDuration } from '@/utils';
import { siteConfig } from '@/config/siteConfig';
import styles from './Watch.module.css';

export default function WatchPage() {
  const state = useFeaturedSermon();
  const { serviceTimes, social } = siteConfig;

  return (
    <>
      <SEO
        title="Watch Online"
        description="Join us live or catch up on the latest message from Jesus The Counselor Cavite, wherever you are."
        path="/watch"
      />
      <PageHero
        eyebrow="Watch"
        title="Watch Online"
        description="Wherever you are, you have a seat with us. Join our live services or catch up on the most recent message on demand."
      >
        {social.youtube && (
          <Button href={social.youtube} external>
            Watch on YouTube
          </Button>
        )}
        <Button to="/sermons" variant="outline">
          Past Messages
        </Button>
      </PageHero>

      <section className="section">
        <Container size="wide">
          <div className={styles.layout}>
            <AnimatedReveal className={styles.player}>
              <AsyncBoundary state={state} loadingLabel="Loading latest message…">
                {(sermon) => (
                  <>
                    <div className={styles.frame}>
                      <VideoPlayer url={sermon.videoUrl} poster={sermon.thumbnail} title={sermon.title} />
                    </div>
                    <div className={styles.meta}>
                      {sermon.series && <Badge>{sermon.series}</Badge>}
                      <h2 className={styles.title}>{sermon.title}</h2>
                      <p className={styles.sub}>
                        {sermon.speaker} · {formatShortDate(sermon.date)} ·{' '}
                        {formatDuration(sermon.durationMinutes)}
                      </p>
                      <div className={styles.actions}>
                        <Button to={`/sermons/${sermon.slug}`}>View Message</Button>
                        <Button to="/sermons" variant="ghost">
                          Past Messages →
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </AsyncBoundary>
            </AnimatedReveal>

            <AnimatedReveal as="aside" className={styles.side} delay={90}>
              <div className={styles.card}>
                <span className="u-eyebrow">
                  <span className="accent-bar" aria-hidden="true" />
                  Live Services
                </span>
                <p className={styles.note}>
                  Our live stream goes live at each service time below. Tune in a few minutes early to
                  worship with us from the first song.
                </p>
                <ul className={styles.times} role="list">
                  {serviceTimes.map((s) => (
                    <li key={s.day} className={styles.time}>
                      <span className={styles.day}>{s.day}</span>
                      <span className={styles.slots}>
                        {s.times.map((t) => (
                          <span key={t} className={styles.slot}>
                            {t}
                          </span>
                        ))}
                      </span>
                      {s.note && <span className={styles.timeNote}>{s.note}</span>}
                    </li>
                  ))}
                </ul>
                <div className={styles.sideActions}>
                  {social.youtube && (
                    <Button href={social.youtube} external variant="outline" size="sm">
                      Watch on YouTube
                    </Button>
                  )}
                  <Button to="/plan-your-visit" variant="ghost" size="sm">
                    Plan Your Visit →
                  </Button>
                </div>
              </div>
            </AnimatedReveal>
          </div>
        </Container>
      </section>
    </>
  );
}
