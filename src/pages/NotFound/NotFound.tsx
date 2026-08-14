import { SEO } from '@/components/common/SEO';
import { Container } from '@/components/common/Container';
import { Button } from '@/components/common/Button';
import styles from './NotFound.module.css';

export default function NotFoundPage() {
  return (
    <>
      <SEO title="Page Not Found" description="The page you're looking for could not be found." path="/404" noindex />
      <section className={styles.wrap}>
        <div className={styles.stage} aria-hidden="true">
          <div className={styles.glow} />
        </div>
        <Container size="narrow">
          <div className={styles.inner}>
            <span className="u-eyebrow">
              <span className="accent-bar" aria-hidden="true" />
              Page Not Found
            </span>
            <p className={styles.code}>404</p>
            <h1 className={styles.title}>We can't find that page</h1>
            <p className={styles.message}>
              The page you're looking for may have moved or no longer exists. Let's get you back to
              somewhere familiar.
            </p>
            <div className={styles.actions}>
              <Button to="/">Back Home</Button>
              <Button to="/sermons" variant="outline">
                Browse Sermons
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
