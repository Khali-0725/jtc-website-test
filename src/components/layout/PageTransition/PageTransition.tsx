import { useEffect, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import styles from './PageTransition.module.css';

/* Route-change treatment: scrolls to top on navigation and plays a
   subtle fade/rise on the incoming page. Keyed on pathname so each
   route mounts fresh. Motion is disabled globally for users who
   prefer reduced motion (see styles/animations.css). */
export function PageTransition({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();

  useEffect(() => {
    // Respect in-page anchor navigation (#hash) — don't fight it.
    if (window.location.hash) return;
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname]);

  return (
    <div key={pathname} className={styles.page}>
      {children}
    </div>
  );
}
