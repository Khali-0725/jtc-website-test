import { Link } from 'react-router-dom';
import type { Ministry } from '@/types';
import { Figure } from '@/components/common/Figure';
import styles from './MinistryCard.module.css';

/* Reusable ministry card — homepage preview + ministries listing. */
export function MinistryCard({ ministry }: { ministry: Ministry }) {
  return (
    <Link to={`/ministries/${ministry.slug}`} className={styles.card}>
      <div className={styles.media}>
        <Figure
          src={ministry.image}
          alt={ministry.name}
          ratio="3/2"
          seed={ministry.slug}
          rounded={false}
          overlay
        />
        <div className={styles.overlay}>
          <span className={styles.category}>{ministry.category}</span>
          <h3 className={styles.title}>{ministry.name}</h3>
          <p className={styles.tagline}>{ministry.tagline}</p>
        </div>
      </div>
    </Link>
  );
}
