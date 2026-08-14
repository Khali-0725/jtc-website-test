import type { ReactNode } from 'react';
import styles from './AdminPageHeader.module.css';

interface AdminPageHeaderProps {
  title: string;
  description?: string;
  /* Right-aligned actions, e.g. a "New" button. */
  actions?: ReactNode;
}

export function AdminPageHeader({ title, description, actions }: AdminPageHeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.text}>
        <h1 className={styles.title}>{title}</h1>
        {description && <p className={styles.description}>{description}</p>}
      </div>
      {actions && <div className={styles.actions}>{actions}</div>}
    </header>
  );
}
