import { useState } from 'react';
import type { FormEvent } from 'react';
import { SEO } from '@/components/common/SEO';
import { PageHero } from '@/components/common/PageHero';
import { Container } from '@/components/common/Container';
import { Button } from '@/components/common/Button';
import { contactService } from '@/services/contactService';
import { useToast } from '@/context/ToastContext';
import { isEmail, isRequired } from '@/utils';
import { siteConfig } from '@/config/siteConfig';
import styles from './Contact.module.css';

interface Errors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

const EMPTY = { name: '', email: '', subject: '', message: '', website: '' };

export default function ContactPage() {
  const { notify } = useToast();
  const { contact, mainCampus, social } = siteConfig;
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function validate(): Errors {
    const next: Errors = {};
    if (!isRequired(form.name)) next.name = 'Please tell us your name.';
    if (!isRequired(form.email)) next.email = 'Email is required.';
    else if (!isEmail(form.email)) next.email = 'Please enter a valid email address.';
    if (!isRequired(form.subject)) next.subject = 'Please add a subject.';
    if (!isRequired(form.message)) next.message = 'Please enter a message.';
    return next;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setSubmitting(true);
    try {
      await contactService.submit({
        name: form.name.trim(),
        email: form.email.trim(),
        subject: form.subject.trim(),
        message: form.message.trim(),
        website: form.website,
      });
      setSubmitted(true);
      setForm(EMPTY);
      notify('Your message has been sent.', 'success');
    } catch {
      notify('Something went wrong. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  }

  const socialLinks = [
    { key: 'facebook', label: 'Facebook', url: social.facebook },
    { key: 'youtube', label: 'YouTube', url: social.youtube },
    { key: 'instagram', label: 'Instagram', url: social.instagram },
    { key: 'tiktok', label: 'TikTok', url: social.tiktok },
  ].filter((s) => s.url);

  return (
    <>
      <SEO
        title="Contact"
        description="Get in touch with Jesus The Counselor Cavite. Send us a message or find our address, phone, email, and office hours."
        path="/contact"
      />
      <PageHero
        eyebrow="Say Hello"
        title="Contact"
        description="Have a question, or want to connect with our team? We'd love to hear from you."
      />

      <section className="section">
        <Container size="wide">
          <div className={styles.layout}>
            <aside className={styles.info}>
              <h2 className={styles.infoTitle}>Get in touch</h2>
              <ul className={styles.infoList} role="list">
                <li className={styles.infoItem}>
                  <span className={styles.infoLabel}>Email</span>
                  <a className={styles.link} href={`mailto:${contact.email}`}>
                    {contact.email}
                  </a>
                </li>
                <li className={styles.infoItem}>
                  <span className={styles.infoLabel}>Phone</span>
                  <a className={styles.link} href={`tel:${contact.phone.replace(/\s+/g, '')}`}>
                    {contact.phone}
                  </a>
                </li>
                <li className={styles.infoItem}>
                  <span className={styles.infoLabel}>Office Hours</span>
                  <span className={styles.infoValue}>{contact.officeHours}</span>
                </li>
                <li className={styles.infoItem}>
                  <span className={styles.infoLabel}>Address</span>
                  <address className={styles.address}>{mainCampus.fullAddress}</address>
                </li>
              </ul>

              <Button href={mainCampus.mapLink} external variant="outline">
                Get Directions
              </Button>

              {socialLinks.length > 0 && (
                <div className={styles.social}>
                  <span className={styles.infoLabel}>Follow along</span>
                  <div className={styles.socialLinks}>
                    {socialLinks.map((s) => (
                      <a
                        key={s.key}
                        className={styles.link}
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {s.label}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </aside>

            <div className={styles.formWrap}>
              {submitted ? (
                <div className={styles.success} role="status">
                  <span className={styles.successIcon} aria-hidden="true">✦</span>
                  <h2 className={styles.successTitle}>Message sent</h2>
                  <p className={styles.successText}>
                    Thank you for reaching out. Our team will get back to you soon.
                  </p>
                  <Button variant="outline" onClick={() => setSubmitted(false)}>
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <form className={styles.form} onSubmit={handleSubmit} noValidate>
                  {/* Honeypot — must stay empty; hidden from users and assistive tech. */}
                  <div className={styles.honeypot} aria-hidden="true">
                    <label htmlFor="ct-website">Leave this field empty</label>
                    <input
                      id="ct-website"
                      type="text"
                      name="website"
                      tabIndex={-1}
                      autoComplete="off"
                      value={form.website}
                      onChange={(e) => setForm((f) => ({ ...f, website: e.target.value }))}
                    />
                  </div>

                  <div className={styles.field}>
                    <label htmlFor="ct-name" className={styles.fieldLabel}>
                      Name
                    </label>
                    <input
                      id="ct-name"
                      type="text"
                      className={styles.input}
                      value={form.name}
                      autoComplete="name"
                      required
                      aria-invalid={!!errors.name}
                      aria-describedby={errors.name ? 'ct-name-error' : undefined}
                      onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    />
                    {errors.name && (
                      <span id="ct-name-error" className={styles.error} role="alert">
                        {errors.name}
                      </span>
                    )}
                  </div>

                  <div className={styles.field}>
                    <label htmlFor="ct-email" className={styles.fieldLabel}>
                      Email
                    </label>
                    <input
                      id="ct-email"
                      type="email"
                      className={styles.input}
                      value={form.email}
                      autoComplete="email"
                      required
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? 'ct-email-error' : undefined}
                      onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    />
                    {errors.email && (
                      <span id="ct-email-error" className={styles.error} role="alert">
                        {errors.email}
                      </span>
                    )}
                  </div>

                  <div className={styles.field}>
                    <label htmlFor="ct-subject" className={styles.fieldLabel}>
                      Subject
                    </label>
                    <input
                      id="ct-subject"
                      type="text"
                      className={styles.input}
                      value={form.subject}
                      required
                      aria-invalid={!!errors.subject}
                      aria-describedby={errors.subject ? 'ct-subject-error' : undefined}
                      onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
                    />
                    {errors.subject && (
                      <span id="ct-subject-error" className={styles.error} role="alert">
                        {errors.subject}
                      </span>
                    )}
                  </div>

                  <div className={styles.field}>
                    <label htmlFor="ct-message" className={styles.fieldLabel}>
                      Message
                    </label>
                    <textarea
                      id="ct-message"
                      className={styles.textarea}
                      rows={6}
                      value={form.message}
                      required
                      aria-invalid={!!errors.message}
                      aria-describedby={errors.message ? 'ct-message-error' : undefined}
                      onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                    />
                    {errors.message && (
                      <span id="ct-message-error" className={styles.error} role="alert">
                        {errors.message}
                      </span>
                    )}
                  </div>

                  <Button type="submit" disabled={submitting}>
                    {submitting ? 'Sending…' : 'Send Message'}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
