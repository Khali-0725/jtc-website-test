import type { ReactNode } from 'react';
import { Container } from '../Container';
import styles from './PageHero.module.css';

interface PageHeroProps {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: 'left' | 'center';
  children?: ReactNode;
}

/* Interior page header band — branded gradient stage with a
   consistent title treatment across all secondary pages. */
export function PageHero({ eyebrow, title, description, align = 'left', children }: PageHeroProps) {
  return (
    <section className={`${styles.hero} ${align === 'center' ? styles.center : ''}`}>
      <div className={styles.stage} aria-hidden="true">
        <div className={styles.glow} />
      </div>
      <Container size="wide">
        <div className={styles.inner}>
          {eyebrow && (
            <span className="u-eyebrow">
              <span className="accent-bar" aria-hidden="true" />
              {eyebrow}
            </span>
          )}
          <h1 className={styles.title}>{title}</h1>
          {description && <p className={styles.description}>{description}</p>}
          {children && <div className={styles.actions}>{children}</div>}
        </div>
      </Container>
    </section>
  );
}
