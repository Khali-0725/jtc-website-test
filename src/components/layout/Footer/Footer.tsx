import { Link } from 'react-router-dom';
import { footerNav } from '@/data/navigation';
import { siteConfig } from '@/config/siteConfig';
import { Container } from '@/components/common/Container';
import { Logo } from '../Navbar/Logo';
import styles from './Footer.module.css';

export function Footer() {
  const year = new Date().getFullYear();
  const { social, mainCampus, contact, serviceTimes } = siteConfig;

  const socials = [
    { label: 'Facebook', href: social.facebook },
    { label: 'YouTube', href: social.youtube },
    { label: 'Instagram', href: social.instagram },
    { label: 'TikTok', href: social.tiktok },
  ].filter((s) => s.href);

  return (
    <footer className={styles.footer}>
      <Container size="wide">
        <div className={styles.top}>
          <div className={styles.brandCol}>
            <Logo />
            <p className={styles.type}>{siteConfig.type}</p>
            <address className={styles.address}>{mainCampus.fullAddress}</address>
            <div className={styles.contact}>
              <a href={`mailto:${contact.email}`}>{contact.email}</a>
              <a href={`tel:${contact.phone.replace(/\s/g, '')}`}>{contact.phone}</a>
            </div>
          </div>

          {footerNav.map((col) => (
            <nav key={col.heading} className={styles.col} aria-label={col.heading}>
              <h3 className={styles.colHeading}>{col.heading}</h3>
              <ul className={styles.colList} role="list">
                {col.items.map((item) => (
                  <li key={`${col.heading}-${item.label}`}>
                    <Link to={item.to} className={styles.colLink}>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div className={styles.col}>
            <h3 className={styles.colHeading}>Gather With Us</h3>
            <ul className={styles.times} role="list">
              {serviceTimes.map((s) => (
                <li key={s.day}>
                  <span className={styles.day}>{s.day}</span>
                  <span className={styles.time}>{s.times.join(' · ')}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className={styles.bottom}>
          <p className={styles.copy}>
            © {year} {siteConfig.name}. All rights reserved.
          </p>
          {socials.length > 0 && (
            <ul className={styles.socials} role="list">
              {socials.map((s) => (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          )}
          <div className={styles.legal}>
            <Link to="/contact">Contact</Link>
            <Link to="/prayer">Prayer</Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
