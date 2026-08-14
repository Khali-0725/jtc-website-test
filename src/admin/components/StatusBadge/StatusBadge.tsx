import type { ReactNode } from 'react';
import { classNames } from '@/utils/helpers';
import styles from './StatusBadge.module.css';

type Tone = 'neutral' | 'success' | 'warning' | 'danger' | 'accent';

interface StatusBadgeProps {
  children: ReactNode;
  tone?: Tone;
}

/* Small status pill for table cells (published, handled, active, role). */
export function StatusBadge({ children, tone = 'neutral' }: StatusBadgeProps) {
  return <span className={classNames(styles.badge, styles[tone])}>{children}</span>;
}
