import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { siteConfig } from '@/config/siteConfig';
import { Button } from '@/components/common';
import { AdminIcon, StatusBadge } from '../../components';
import styles from './AdminLayout.module.css';

interface AdminTopbarProps {
  onToggleSidebar: () => void;
  sidebarOpen: boolean;
}

const roleTone: Record<string, 'accent' | 'success' | 'neutral'> = {
  SUPER_ADMIN: 'accent',
  ADMIN: 'accent',
  EDITOR: 'success',
  STAFF: 'neutral',
};

export function AdminTopbar({ onToggleSidebar, sidebarOpen }: AdminTopbarProps) {
  const { user, logout } = useAuth();
  const { notify } = useToast();
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await logout();
      notify('You have been signed out.', 'info');
      navigate('/admin/login', { replace: true });
    } catch {
      notify('Could not sign out. Please try again.', 'error');
      setLoggingOut(false);
    }
  }

  const roleLabel = user ? user.role.replace('_', ' ') : '';

  return (
    <header className={styles.topbar}>
      <div className={styles.topbarLeft}>
        <button
          type="button"
          className={styles.menuButton}
          onClick={onToggleSidebar}
          aria-label={sidebarOpen ? 'Close navigation' : 'Open navigation'}
          aria-expanded={sidebarOpen}
        >
          <AdminIcon name={sidebarOpen ? 'close' : 'menu'} size={22} />
        </button>
        <span className={styles.siteName}>{siteConfig.name}</span>
      </div>

      <div className={styles.topbarRight}>
        <Button to="/" variant="ghost" size="sm" rightIcon={<AdminIcon name="external" size={16} />}>
          View site
        </Button>
        {user && (
          <div className={styles.userBox}>
            <span className={styles.userName}>{user.name}</span>
            <StatusBadge tone={roleTone[user.role] ?? 'neutral'}>{roleLabel}</StatusBadge>
          </div>
        )}
        <Button
          variant="outline"
          size="sm"
          onClick={handleLogout}
          disabled={loggingOut}
          leftIcon={<AdminIcon name="logout" size={16} />}
        >
          {loggingOut ? 'Signing out…' : 'Logout'}
        </Button>
      </div>
    </header>
  );
}
