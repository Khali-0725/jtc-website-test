import { useParams, Link } from 'react-router-dom';
import { SEO } from '@/components/common/SEO';
import { Container } from '@/components/common/Container';
import { Button } from '@/components/common/Button';
import { Figure } from '@/components/common/Figure';
import { AsyncBoundary } from '@/components/common/AsyncBoundary';
import { EmptyState } from '@/components/common/EmptyState';
import { useMinistry } from '@/hooks';
import styles from './MinistryDetails.module.css';

export default function MinistryDetailsPage() {
  const { slug = '' } = useParams();
  const state = useMinistry(slug);

  return (
    <article className={styles.page}>
      <AsyncBoundary
        state={state}
        loadingLabel="Loading ministry…"
        empty={
          <Container size="narrow">
            <div className={styles.missing}>
              <EmptyState title="Ministry not found" message="This ministry may have been moved or removed." />
              <Button to="/ministries" variant="outline">
                Back to Ministries
              </Button>
            </div>
          </Container>
        }
      >
        {(ministry) => (
          <>
            <SEO
              title={ministry.name}
              description={ministry.tagline}
              path={`/ministries/${ministry.slug}`}
              type="article"
              image={ministry.image}
            />

            <Container size="wide" className={styles.head}>
              <Link to="/ministries" className={styles.back}>
                ← All Ministries
              </Link>
              <span className="u-eyebrow">
                <span className="accent-bar" aria-hidden="true" />
                {ministry.category}
              </span>
              <h1 className={styles.title}>{ministry.name}</h1>
              <p className={styles.lead}>{ministry.tagline}</p>
            </Container>

            <Container size="wide">
              <div className={styles.layout}>
                <div className={styles.media}>
                  <Figure src={ministry.image} alt={ministry.name} ratio="4/5" seed={ministry.slug} eager />
                </div>

                <div className={styles.info}>
                  <p className={styles.description}>{ministry.description}</p>

                  <dl className={styles.details}>
                    <div className={styles.detailRow}>
                      <dt className={styles.detailTerm}>Audience</dt>
                      <dd className={styles.detailValue}>{ministry.audience}</dd>
                    </div>
                    <div className={styles.detailRow}>
                      <dt className={styles.detailTerm}>When</dt>
                      <dd className={styles.detailValue}>{ministry.schedule}</dd>
                    </div>
                    <div className={styles.detailRow}>
                      <dt className={styles.detailTerm}>Where</dt>
                      <dd className={styles.detailValue}>{ministry.location}</dd>
                    </div>
                  </dl>

                  {ministry.contactEmail && (
                    <a className={styles.contact} href={`mailto:${ministry.contactEmail}`}>
                      {ministry.contactEmail}
                    </a>
                  )}

                  <div className={styles.actions}>
                    {ministry.ctaUrl && (
                      <Button href={ministry.ctaUrl} external variant="primary">
                        {ministry.ctaLabel ?? 'Get Connected'}
                      </Button>
                    )}
                    <Button to="/contact" variant="outline">
                      Ask a Question
                    </Button>
                  </div>
                </div>
              </div>
            </Container>
          </>
        )}
      </AsyncBoundary>
    </article>
  );
}
