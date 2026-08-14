import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import type { UserRole } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { Loading } from '@/components/common';
import styles from './RequireAuth.module.css';

interface RequireAuthProps {
  children: ReactNode;
  /* Optional allow-list of roles. When omitted, any authenticated
     user may pass. When set, the user's role must be included. */
  roles?: UserRole[];
}

/* Gate for the admin area.
   - loading            -> full-screen spinner
   - unauthenticated    -> redirect to /admin/login (remembers intent)
   - authenticated but
     wrong role         -> inline "Access denied" panel */
export function RequireAuth({ children, roles }: RequireAuthProps) {
  const { status, user } = useAuth();
  const location = useLocation();

  if (status === 'loading') {
    return <Loading fullscreen label="Checking your session…" />;
  }

  if (status === 'unauthenticated' || !user) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  if (roles && !roles.includes(user.role)) {
    return (
      <div className={styles.denied} role="alert">
        <span className={styles.icon} aria-hidden="true">
          !
        </span>
        <h1 className={styles.title}>Access denied</h1>
        <p className={styles.message}>
          Your account ({user.role.replace('_', ' ').toLowerCase()}) does not have permission to
          view this page. Contact an administrator if you believe this is a mistake.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
