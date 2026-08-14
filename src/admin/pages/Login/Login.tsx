import { useState } from 'react';
import type { FormEvent } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { siteConfig } from '@/config/siteConfig';
import { SEO, Button } from '@/components/common';
import { ApiError } from '@/services';
import { FormField, Input } from '../../components';
import styles from './Login.module.css';

interface LocationState {
  from?: { pathname: string };
}

export default function LoginPage() {
  const { status, login } = useAuth();
  const { notify } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const redirectTo = (location.state as LocationState | null)?.from?.pathname ?? '/admin';

  // Already signed in — skip the form.
  if (status === 'authenticated') {
    return <Navigate to={redirectTo} replace />;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError('Enter your email and password to continue.');
      return;
    }

    setSubmitting(true);
    try {
      await login({ email: email.trim(), password });
      notify('Welcome back.', 'success');
      navigate(redirectTo, { replace: true });
    } catch (err) {
      const message =
        err instanceof ApiError && err.status === 401
          ? 'Incorrect email or password.'
          : err instanceof Error
            ? err.message
            : 'Unable to sign in. Please try again.';
      setError(message);
      notify(message, 'error');
      setSubmitting(false);
    }
  }

  return (
    <div className={styles.wrap}>
      <SEO title="Admin Sign In" path="/admin/login" noindex />
      <div className={styles.card}>
        <div className={styles.brand}>
          <span className={styles.mark} aria-hidden="true">
            {siteConfig.initials}
          </span>
          <div>
            <h1 className={styles.title}>Admin Sign In</h1>
            <p className={styles.subtitle}>{siteConfig.name}</p>
          </div>
        </div>

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <FormField label="Email" htmlFor="admin-email" required>
            <Input
              id="admin-email"
              name="email"
              type="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@church.org"
              disabled={submitting}
              required
            />
          </FormField>

          <FormField label="Password" htmlFor="admin-password" required>
            <Input
              id="admin-password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••"
              disabled={submitting}
              required
            />
          </FormField>

          {error && (
            <p className={styles.error} role="alert">
              {error}
            </p>
          )}

          <Button type="submit" fullWidth disabled={submitting}>
            {submitting ? 'Signing in…' : 'Sign in'}
          </Button>
        </form>

        <p className={styles.footnote}>
          Authorized personnel only. All activity is logged and monitored.
        </p>
      </div>
    </div>
  );
}
