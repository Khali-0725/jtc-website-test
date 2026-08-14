import { useState } from 'react';
import { SEO } from '@/components/common/SEO';
import { PageHero } from '@/components/common/PageHero';
import { Container } from '@/components/common/Container';
import { SectionHeader } from '@/components/common/SectionHeader';
import { AnimatedReveal } from '@/components/common/AnimatedReveal';
import { givingCategories } from '@/data/constants';
import { classNames } from '@/utils';
import styles from './Give.module.css';

/* Placeholder methods — the church replaces the [PLACEHOLDER] details
   before publishing. No real payment integration exists here. */
const waysToGive = [
  {
    key: 'in-person',
    title: 'In Person',
    detail: 'Give during any weekend or midweek service at the designated giving points.',
    placeholder: '[PLACEHOLDER] — describe where to give on campus',
  },
  {
    key: 'bank-transfer',
    title: 'Bank Transfer',
    detail: 'Send your gift directly to the church account.',
    placeholder: '[PLACEHOLDER] — Bank name • Account name • Account number',
  },
  {
    key: 'online',
    title: 'Online',
    detail: 'Give online through the church’s chosen giving provider.',
    placeholder: '[PLACEHOLDER] — add the online giving link',
  },
] as const;

export default function GivePage() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <>
      <SEO
        title="Give"
        description="Generosity is worship. Learn about the ways you can give and partner with the mission of Jesus The Counselor Cavite."
        path="/give"
      />
      <PageHero
        eyebrow="Generosity"
        title="Give"
        description="Giving is an act of worship and an overflow of a grateful heart. Everything we have comes from God, and generosity lets us join in what He is doing in our city and beyond."
      />

      <section className="section">
        <Container size="wide">
          <SectionHeader
            eyebrow="Where It Goes"
            title="Give toward what stirs your heart"
            description="Every gift, whatever the designation, is stewarded to advance the mission of the church."
          />
          <ul className={styles.grid} role="list">
            {givingCategories.map((cat, i) => {
              const active = selected === cat.key;
              return (
                <AnimatedReveal as="li" key={cat.key} delay={(i % 3) * 80}>
                  <button
                    type="button"
                    className={classNames(styles.card, active && styles.cardActive)}
                    aria-pressed={active}
                    onClick={() => setSelected((prev) => (prev === cat.key ? null : cat.key))}
                  >
                    <span className={styles.cardLabel}>{cat.label}</span>
                    <span className={styles.cardBlurb}>{cat.blurb}</span>
                  </button>
                </AnimatedReveal>
              );
            })}
          </ul>
        </Container>
      </section>

      <section className="section section--tight">
        <Container size="wide">
          <SectionHeader
            eyebrow="Ways to Give"
            title="Choose the way that works for you"
            description="The details below are placeholders — our team will publish the confirmed giving information soon."
          />
          <ul className={styles.ways} role="list">
            {waysToGive.map((way, i) => (
              <AnimatedReveal as="li" key={way.key} delay={(i % 3) * 80} className={styles.way}>
                <h3 className={styles.wayTitle}>{way.title}</h3>
                <p className={styles.wayDetail}>{way.detail}</p>
                <p className={styles.wayPlaceholder}>{way.placeholder}</p>
              </AnimatedReveal>
            ))}
          </ul>
          <p className={styles.reassurance}>
            We are committed to handling every gift with integrity and care. Giving is always
            voluntary, and confirmed, secure giving details will be published here before launch.
          </p>
        </Container>
      </section>
    </>
  );
}
