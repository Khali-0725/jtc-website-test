import { Link } from 'react-router-dom';
import { siteConfig } from '@/config/siteConfig';
import { classNames } from '@/utils/helpers';
import styles from './Logo.module.css';

interface LogoProps {
  variant?: 'full' | 'compact';
  className?: string;
}

/* Site wordmark for the header/footer.
   NOTE: This is a typographic wordmark + placeholder glyph — it does NOT
   redesign the church's official logo (white dove + blue cross). Drop the
   real logo at siteConfig.brand.logoSrc to display it instead. */
export function Logo({ variant = 'full', className }: LogoProps) {
  return (
    <Link to="/" className={classNames(styles.logo, className)} aria-label={`${siteConfig.name} — home`}>
      <span className={styles.mark} aria-hidden="true">
        <svg viewBox="0 0 32 32" width="30" height="30" role="img">
          {/* Simple dove-swoosh + cross glyph echoing the brand (placeholder). */}
          <path
            d="M6 20c6 1 10-2 13-8 1 3 0 6-2 8 3 0 6-1 8-4-1 6-7 10-13 10-3 0-6-2-6-6z"
            fill="#f4f7fb"
            opacity="0.95"
          />
          <rect x="20.5" y="6" width="2.6" height="15" rx="1" fill="var(--accent-blue)" />
          <rect x="17" y="10.2" width="9.6" height="2.6" rx="1" fill="var(--accent-blue)" />
        </svg>
      </span>
      {variant === 'full' && (
        <span className={styles.words}>
          <span className={styles.name}>Jesus The Counselor</span>
          <span className={styles.sub}>Cavite</span>
        </span>
      )}
    </Link>
  );
}
