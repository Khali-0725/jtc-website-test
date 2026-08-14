import { NavLink } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { siteConfig } from '@/config/siteConfig';
import { classNames } from '@/utils/helpers';
import { adminNavSections } from '../../adminNav';
import { AdminIcon } from '../../components';
import styles from './AdminLayout.module.css';

interface AdminSidebarProps {
  open: boolean;
  onNavigate: () => void;
}

/* Sidebar navigation — items filtered by the current user's
   permissions and role so people only see what they can use. */
export function AdminSidebar({ open, onNavigate }: AdminSidebarProps) {
  const { user, hasPermission } = useAuth();

  const canSee = (permission?: string, roles?: string[]) => {
    if (permission && !hasPermission(permission as never)) return false;
    if (roles && (!user || !roles.includes(user.role))) return false;
    return true;
  };

  return (
    <aside className={classNames(styles.sidebar, open && styles.sidebarOpen)}>
      <div className={styles.brand}>
        <span className={styles.brandMark} aria-hidden="true">
          {siteConfig.initials}
        </span>
        <span className={styles.brandText}>
          <span className={styles.brandName}>{siteConfig.shortName}</span>
          <span className={styles.brandKicker}>Admin</span>
        </span>
      </div>

      <nav className={styles.nav} aria-label="Admin navigation">
        {adminNavSections.map((section, i) => {
          const items = section.items.filter((item) => canSee(item.permission, item.roles));
          if (items.length === 0) return null;
          return (
            <div key={section.heading ?? `section-${i}`} className={styles.navGroup}>
              {section.heading && <p className={styles.navHeading}>{section.heading}</p>}
              <ul className={styles.navList} role="list">
                {items.map((item) => (
                  <li key={item.to}>
                    <NavLink
                      to={item.to}
                      end={item.end}
                      onClick={onNavigate}
                      className={({ isActive }) =>
                        classNames(styles.navLink, isActive && styles.navLinkActive)
                      }
                    >
                      <span className={styles.navIcon}>
                        <AdminIcon name={item.icon} size={18} />
                      </span>
                      {item.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
