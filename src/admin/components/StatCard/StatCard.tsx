import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { classNames } from '@/utils/helpers';
import styles from './StatCard.module.css';

interface StatCardProps {
  label: string;
  value: ReactNode;
  icon?: ReactNode;
  hint?: string;
  to?: string;
  loading?: boolean;
  /* Accent variant for attention-worthy stats (e.g. pending items). */
  tone?: 'default' | 'accent' | 'warning';
}

export function StatCard({ label, value, icon, hint, to, loading, tone = 'default' }: StatCardProps) {
  const body = (
    <>
      <div className={styles.top}>
        <span className={styles.label}>{label}</span>
        {icon && (
          <span className={styles.icon} aria-hidden="true">
            {icon}
          </span>
        )}
      </div>
      <span className={styles.value}>{loading ? '…' : value}</span>
      {hint && <span className={styles.hint}>{hint}</span>}
    </>
  );

  const className = classNames(styles.card, styles[tone], to && styles.linked);

  if (to) {
    return (
      <Link to={to} className={className}>
        {body}
      </Link>
    );
  }
  return <div className={className}>{body}</div>;
}
