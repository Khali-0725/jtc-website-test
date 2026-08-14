import { Button } from '@/components/common/Button';
import { Container } from '@/components/common/Container';
import { siteConfig } from '@/config/siteConfig';
import { useSettings } from '@/context/SettingsContext';
import styles from './Hero.module.css';

/* Full-bleed cinematic hero. Uses a branded gradient stage by
   default; when an admin sets a hero background image in
   Admin → Branding it renders behind a legibility scrim. */
export function Hero() {
  const next = siteConfig.serviceTimes[0];
  const { settings } = useSettings();
  const heroImage = settings.heroImageUrl?.trim();

  return (
    <section className={styles.hero} aria-label="Welcome">
      <div className={styles.stage} aria-hidden="true">
        {heroImage && (
          <>
            <div className={styles.photo} style={{ backgroundImage: `url(${heroImage})` }} />
            <div className={styles.scrim} />
          </>
        )}
        <div className={styles.glow} />
        <div className={styles.grid} />
      </div>

      <Container size="wide" className={styles.inner}>
        <p className={styles.eyebrow}>
          <span className="accent-bar" aria-hidden="true" />
          {siteConfig.type}
        </p>

        <h1 className={styles.title}>
          <span className={styles.script}>{siteConfig.tagline}</span>
          <span className={styles.heading}>{siteConfig.name}</span>
        </h1>

        <p className={styles.lead}>{siteConfig.mission}</p>

        <div className={styles.actions}>
          <Button to="/plan-your-visit" size="lg">
            Plan Your Visit
          </Button>
          <Button to="/watch" variant="outline" size="lg">
            Watch Online
          </Button>
        </div>

        {next && (
          <p className={styles.next}>
            <span className={styles.nextLabel}>Next gathering</span>
            <span className={styles.nextValue}>
              {next.day} · {next.times.join(' · ')}
            </span>
          </p>
        )}
      </Container>

      <div className={styles.scrollCue} aria-hidden="true">
        <span />
      </div>
    </section>
  );
}
