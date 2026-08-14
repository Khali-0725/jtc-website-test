import { useState } from 'react';
import type { FormEvent } from 'react';
import { SEO } from '@/components/common/SEO';
import { PageHero } from '@/components/common/PageHero';
import { Container } from '@/components/common/Container';
import { Button } from '@/components/common/Button';
import { prayerService } from '@/services/prayerService';
import { useToast } from '@/context/ToastContext';
import { isEmail, isRequired } from '@/utils';
import { siteConfig } from '@/config/siteConfig';
import styles from './Prayer.module.css';

interface Errors {
  email?: string;
  request?: string;
}

const EMPTY = { name: '', email: '', request: '', anonymous: false, website: '' };

export default function PrayerPage() {
  const { notify } = useToast();
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function validate(): Errors {
    const next: Errors = {};
    if (!isRequired(form.request)) next.request = 'Please share your prayer request.';
    if (!isRequired(form.email)) next.email = 'Email is required so we can follow up.';
    else if (!isEmail(form.email)) next.email = 'Please enter a valid email address.';
    return next;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setSubmitting(true);
    try {
      await prayerService.submit({
        name: form.anonymous ? '' : form.name.trim(),
        email: form.email.trim(),
        request: form.request.trim(),
        anonymous: form.anonymous,
        website: form.website,
      });
      setSubmitted(true);
      setForm(EMPTY);
      notify('Your prayer request has been received.', 'success');
    } catch {
      notify('Something went wrong. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <SEO
        title="Prayer Request"
        description="Share a prayer request with the Jesus The Counselor Cavite prayer team. Every request is handled privately and with care."
        path="/prayer"
      />
      <PageHero
        eyebrow="We're Here"
        title="Prayer Request"
        description="Whatever you're facing, you don't have to carry it alone. Share your request below and our prayer team will lift it up privately and with care."
      />

      <section className="section">
        <Container size="narrow">
          {submitted ? (
            <div className={styles.success} role="status">
              <span className={styles.successIcon} aria-hidden="true">✦</span>
              <h2 className={styles.successTitle}>Thank you</h2>
              <p className={styles.successText}>
                Your request has been received by our prayer team. We are honored to stand with you
                in prayer.
              </p>
              <div className={styles.successActions}>
                <Button variant="outline" onClick={() => setSubmitted(false)}>
                  Submit Another Request
                </Button>
                <Button to="/" variant="ghost">
                  Back Home →
                </Button>
              </div>
            </div>
          ) : (
            <form className={styles.form} onSubmit={handleSubmit} noValidate>
              {/* Honeypot — must stay empty; hidden from users and assistive tech. */}
              <div className={styles.honeypot} aria-hidden="true">
                <label htmlFor="pr-website">Leave this field empty</label>
                <input
                  id="pr-website"
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  value={form.website}
                  onChange={(e) => setForm((f) => ({ ...f, website: e.target.value }))}
                />
              </div>

              <label className={styles.checkboxRow}>
                <input
                  type="checkbox"
                  checked={form.anonymous}
                  onChange={(e) => setForm((f) => ({ ...f, anonymous: e.target.checked }))}
                />
                <span>Submit this request anonymously</span>
              </label>

              {!form.anonymous && (
                <div className={styles.field}>
                  <label htmlFor="pr-name" className={styles.label}>
                    Name <span className={styles.optional}>(optional)</span>
                  </label>
                  <input
                    id="pr-name"
                    type="text"
                    className={styles.input}
                    value={form.name}
                    autoComplete="name"
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  />
                </div>
              )}

              <div className={styles.field}>
                <label htmlFor="pr-email" className={styles.label}>
                  Email
                </label>
                <input
                  id="pr-email"
                  type="email"
                  className={styles.input}
                  value={form.email}
                  autoComplete="email"
                  required
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? 'pr-email-error' : undefined}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                />
                {errors.email && (
                  <span id="pr-email-error" className={styles.error} role="alert">
                    {errors.email}
                  </span>
                )}
              </div>

              <div className={styles.field}>
                <label htmlFor="pr-request" className={styles.label}>
                  Prayer request
                </label>
                <textarea
                  id="pr-request"
                  className={styles.textarea}
                  rows={6}
                  value={form.request}
                  required
                  aria-invalid={!!errors.request}
                  aria-describedby={errors.request ? 'pr-request-error' : undefined}
                  onChange={(e) => setForm((f) => ({ ...f, request: e.target.value }))}
                />
                {errors.request && (
                  <span id="pr-request-error" className={styles.error} role="alert">
                    {errors.request}
                  </span>
                )}
              </div>

              <Button type="submit" disabled={submitting}>
                {submitting ? 'Sending…' : 'Send Prayer Request'}
              </Button>

              <p className={styles.alt}>
                Prefer email? Reach our prayer team at{' '}
                <a className={styles.link} href={`mailto:${siteConfig.contact.prayerEmail}`}>
                  {siteConfig.contact.prayerEmail}
                </a>
                .
              </p>
            </form>
          )}
        </Container>
      </section>
    </>
  );
}
