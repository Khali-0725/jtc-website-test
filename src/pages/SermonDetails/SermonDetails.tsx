import { useParams, Link } from 'react-router-dom';
import { SEO } from '@/components/common/SEO';
import { Container } from '@/components/common/Container';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Card';
import { VideoPlayer } from '@/components/common/VideoPlayer';
import { AsyncBoundary } from '@/components/common/AsyncBoundary';
import { EmptyState } from '@/components/common/EmptyState';
import { useSermon } from '@/hooks';
import { formatDate, formatDuration } from '@/utils';
import styles from './SermonDetails.module.css';

export default function SermonDetailsPage() {
  const { slug = '' } = useParams();
  const state = useSermon(slug);

  return (
    <article className={styles.page}>
      <AsyncBoundary
        state={state}
        loadingLabel="Loading message…"
        empty={
          <Container size="narrow">
            <div className={styles.missing}>
              <EmptyState title="Sermon not found" message="This message may have been moved or removed." />
              <Button to="/sermons" variant="outline">
                Back to Sermons
              </Button>
            </div>
          </Container>
        }
      >
        {(sermon) => (
          <>
            <SEO
              title={sermon.title}
              description={sermon.description}
              path={`/sermons/${sermon.slug}`}
              type="video.other"
              image={sermon.thumbnail}
            />

            <Container size="wide" className={styles.head}>
              <Link to="/sermons" className={styles.back}>
                ← All Sermons
              </Link>
              {sermon.series && <Badge>{sermon.series}</Badge>}
              <h1 className={styles.title}>{sermon.title}</h1>
              <p className={styles.meta}>
                {sermon.speaker} · {formatDate(sermon.date)} · {formatDuration(sermon.durationMinutes)}
              </p>
            </Container>

            <Container size="wide">
              <div className={styles.player}>
                <VideoPlayer url={sermon.videoUrl} poster={sermon.thumbnail} title={sermon.title} />
              </div>
            </Container>

            <Container size="narrow" className={styles.body}>
              {sermon.scripture && <p className={styles.scripture}>{sermon.scripture}</p>}
              <p className={styles.description}>{sermon.description}</p>

              {sermon.tags.length > 0 && (
                <ul className={styles.tags} role="list">
                  {sermon.tags.map((t) => (
                    <li key={t} className={styles.tag}>
                      {t}
                    </li>
                  ))}
                </ul>
              )}

              <div className={styles.actions}>
                {sermon.audioUrl && (
                  <Button href={sermon.audioUrl} external variant="outline">
                    Listen to Audio
                  </Button>
                )}
                <Button to="/sermons" variant="ghost">
                  More Messages →
                </Button>
              </div>
            </Container>
          </>
        )}
      </AsyncBoundary>
    </article>
  );
}
