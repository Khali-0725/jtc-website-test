import { Container } from '@/components/common/Container';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Card';
import { VideoPlayer } from '@/components/common/VideoPlayer';
import { AsyncBoundary } from '@/components/common/AsyncBoundary';
import { AnimatedReveal } from '@/components/common/AnimatedReveal';
import { useFeaturedSermon } from '@/hooks';
import { formatShortDate, formatDuration } from '@/utils';
import styles from './LatestSermon.module.css';

/* Latest / featured sermon spotlight with an inline player. */
export function LatestSermon() {
  const state = useFeaturedSermon();

  return (
    <section className={`section ${styles.wrap}`} aria-labelledby="latest-sermon-title">
      <Container size="wide">
        <div className={styles.head}>
          <span className="u-eyebrow">
            <span className="accent-bar" aria-hidden="true" />
            Latest Message
          </span>
          <Button to="/sermons" variant="ghost" className={styles.allLink}>
            All Sermons →
          </Button>
        </div>

        <AsyncBoundary state={state} loadingLabel="Loading latest message…">
          {(sermon) => (
            <AnimatedReveal className={styles.grid}>
              <div className={styles.player}>
                <VideoPlayer url={sermon.videoUrl} poster={sermon.thumbnail} title={sermon.title} />
              </div>
              <div className={styles.meta}>
                {sermon.series && <Badge>{sermon.series}</Badge>}
                <h2 id="latest-sermon-title" className={styles.title}>
                  {sermon.title}
                </h2>
                <p className={styles.sub}>
                  {sermon.speaker} · {formatShortDate(sermon.date)} ·{' '}
                  {formatDuration(sermon.durationMinutes)}
                </p>
                {sermon.scripture && <p className={styles.scripture}>{sermon.scripture}</p>}
                <p className={styles.desc}>{sermon.description}</p>
                <div className={styles.actions}>
                  <Button to={`/sermons/${sermon.slug}`}>View Message</Button>
                  <Button to="/watch" variant="outline">
                    Watch Live
                  </Button>
                </div>
              </div>
            </AnimatedReveal>
          )}
        </AsyncBoundary>
      </Container>
    </section>
  );
}
