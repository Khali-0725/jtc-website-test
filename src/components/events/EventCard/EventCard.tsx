import { Link } from 'react-router-dom';
import type { ChurchEvent } from '@/types';
import { Figure } from '@/components/common/Figure';
import { Badge } from '@/components/common/Card';
import { formatMonthDay } from '@/utils';
import styles from './EventCard.module.css';

/* Reusable event card — used on the homepage preview and the
   Events listing. Editorial layout with a date chip overlay. */
export function EventCard({ event }: { event: ChurchEvent }) {
  const { month, day } = formatMonthDay(event.startDate);

  return (
    <Link to={`/events/${event.slug}`} className={styles.card}>
      <div className={styles.media}>
        <Figure src={event.image} alt={event.title} ratio="4/3" seed={event.slug} rounded={false} />
        <span className={styles.date} aria-hidden="true">
          <span className={styles.month}>{month}</span>
          <span className={styles.day}>{day}</span>
        </span>
      </div>
      <div className={styles.body}>
        <Badge>{event.category}</Badge>
        <h3 className={styles.title}>{event.title}</h3>
        <p className={styles.meta}>
          {event.time} · {event.locationName}
        </p>
        <p className={styles.excerpt}>{event.description}</p>
      </div>
    </Link>
  );
}
