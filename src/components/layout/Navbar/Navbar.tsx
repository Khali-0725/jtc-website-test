import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { primaryNav, secondaryNav, primaryCta } from '@/data/navigation';
import { classNames } from '@/utils/helpers';
import { Button } from '@/components/common/Button';
import { Search } from '@/components/common/Search';
import { Logo } from './Logo';
import { MobileMenu } from '../MobileMenu';
import styles from './Navbar.module.css';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close the mobile menu on route change.
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  return (
    <>
      <header className={classNames(styles.navbar, scrolled && styles.scrolled)}>
        <div className={styles.inner}>
          <Logo />

          <nav className={styles.primary} aria-label="Primary">
            {primaryNav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) => classNames(styles.link, isActive && styles.active)}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className={styles.actions}>
            <button
              className={styles.iconBtn}
              onClick={() => setSearchOpen(true)}
              aria-label="Open search"
            >
              <span aria-hidden="true">⌕</span>
            </button>

            {secondaryNav.map((item) => (
              <NavLink key={item.to} to={item.to} className={styles.secondaryLink}>
                {item.label}
              </NavLink>
            ))}

            <Button to={primaryCta.to} size="sm">
              {primaryCta.label}
            </Button>

            <button
              className={classNames(styles.hamburger, 'tap-target')}
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              aria-expanded={menuOpen}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>

      <MobileMenu
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        onOpenSearch={() => {
          setMenuOpen(false);
          setSearchOpen(true);
        }}
      />
      <Search isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
