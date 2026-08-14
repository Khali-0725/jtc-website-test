import type { ReactNode } from 'react';
import { classNames } from '@/utils/helpers';
import styles from './SectionHeader.module.css';

interface SectionHeaderProps {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: 'left' | 'center';
  as?: 'h1' | 'h2' | 'h3';
  className?: string;
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = 'left',
  as: Heading = 'h2',
  className,
}: SectionHeaderProps) {
  return (
    <header className={classNames(styles.header, styles[align], className)}>
      {eyebrow && (
        <span className="u-eyebrow">
          <span className="accent-bar" aria-hidden="true" />
          {eyebrow}
        </span>
      )}
      <Heading className={styles.title}>{title}</Heading>
      {description && <p className={classNames('u-lead', styles.desc)}>{description}</p>}
    </header>
  );
}
