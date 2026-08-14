import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { classNames } from '@/utils/helpers';
import styles from './Card.module.css';

interface CardProps {
  children: ReactNode;
  to?: string;
  className?: string;
  interactive?: boolean;
}

export function Card({ children, to, className, interactive = true }: CardProps) {
  const cls = classNames(styles.card, interactive && styles.interactive, className);
  if (to) {
    return (
      <Link to={to} className={cls}>
        {children}
      </Link>
    );
  }
  return <div className={cls}>{children}</div>;
}

export function Badge({ children }: { children: ReactNode }) {
  return <span className={styles.badge}>{children}</span>;
}
