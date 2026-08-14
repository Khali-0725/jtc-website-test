import type { ReactNode } from 'react';
import styles from './EmptyState.module.css';

interface EmptyStateProps {
  title?: string;
  message?: string;
  action?: ReactNode;
  icon?: ReactNode;
}

export function EmptyState({
  title = 'Nothing here yet',
  message = 'There is no content to show right now. Please check back soon.',
  action,
  icon,
}: EmptyStateProps) {
  return (
    <div className={styles.wrap} role="status">
      <span className={styles.icon} aria-hidden="true">{icon ?? '✦'}</span>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.message}>{message}</p>
      {action && <div className={styles.action}>{action}</div>}
    </div>
  );
}
