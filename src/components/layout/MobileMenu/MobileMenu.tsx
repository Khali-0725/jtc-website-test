import { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { primaryNav, secondaryNav, primaryCta } from '@/data/navigation';
import { siteConfig } from '@/config/siteConfig';
import { Button } from '@/components/common/Button';
import { classNames } from '@/utils/helpers';
import styles from './MobileMenu.module.css';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSearch: () => void;
}

export function MobileMenu({ isOpen, onClose, onOpenSearch }: MobileMenuProps) {
  useEffect(() => {
    if (isOpen) document.body.classList.add('no-scroll');
    else document.body.classList.remove('no-scroll');
    return () => document.body.classList.remove('no-scroll');
  }, [isOpen]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className={classNames(styles.menu, isOpen && styles.open)} aria-hidden={!isOpen}>
      <div className={styles.header}>
        <span className={styles.brand}>{siteConfig.shortName}</span>
        <button className={styles.close} onClick={onClose} aria-label="Close menu">
          ✕
        </button>
      </div>

      <nav className={styles.nav} aria-label="Mobile">
        {primaryNav.map((item, i) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) => classNames(styles.link, isActive && styles.active)}
            style={{ transitionDelay: isOpen ? `${80 + i * 45}ms` : '0ms' }}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className={styles.secondary}>
        {secondaryNav.map((item) => (
          <NavLink key={item.to} to={item.to} className={styles.secondaryLink}>
            {item.label}
          </NavLink>
        ))}
        <button className={styles.secondaryLink} onClick={onOpenSearch}>
          Search
        </button>
      </div>

      <div className={styles.footer}>
        <Button to={primaryCta.to} fullWidth size="lg">
          {primaryCta.label}
        </Button>
        <div className={styles.times}>
          {siteConfig.serviceTimes.map((s) => (
            <p key={s.day}>
              <strong>{s.day}</strong> · {s.times.join(' · ')}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
