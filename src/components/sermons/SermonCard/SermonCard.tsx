import { Link } from 'react-router-dom';
import type { Sermon } from '@/types';
import { Figure } from '@/components/common/Figure';
import { formatShortDate, formatDuration } from '@/utils';
import styles from './SermonCard.module.css';

/* Reusable sermon card with a play affordance over the thumbnail. */
export function SermonCard({ sermon }: { sermon: Sermon }) {
  return (
    <Link to={`/sermons/${sermon.slug}`} className={styles.card}>
      <div className={styles.media}>
        <Figure src={sermon.thumbnail} alt={sermon.title} ratio="16/9" seed={sermon.slug} rounded={false} />
        <span className={styles.play} aria-hidden="true">
          ▶
        </span>
        <span className={styles.duration}>{formatDuration(sermon.durationMinutes)}</span>
      </div>
      <div className={styles.body}>
        {sermon.series && <span className={styles.series}>{sermon.series}</span>}
        <h3 className={styles.title}>{sermon.title}</h3>
        <p className={styles.meta}>
          {sermon.speaker} · {formatShortDate(sermon.date)}
        </p>
        {sermon.scripture && <p className={styles.scripture}>{sermon.scripture}</p>}
      </div>
    </Link>
  );
}
