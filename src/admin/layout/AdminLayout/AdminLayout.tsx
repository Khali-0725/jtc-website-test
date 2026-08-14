import { Suspense, useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { classNames } from '@/utils/helpers';
import { Loading } from '@/components/common';
import { AdminSidebar } from './AdminSidebar';
import { AdminTopbar } from './AdminTopbar';
import styles from './AdminLayout.module.css';

/* Admin shell: fixed sidebar + top bar + routed <Outlet/> content.
   Renders its OWN chrome — the public Navbar/Footer are intentionally
   absent here. Sidebar collapses to an overlay drawer on mobile. */
export function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { pathname } = useLocation();

  // Close the mobile drawer and scroll to top on route change.
  useEffect(() => {
    setSidebarOpen(false);
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname]);

  return (
    <div className={styles.shell}>
      <AdminSidebar open={sidebarOpen} onNavigate={() => setSidebarOpen(false)} />

      {sidebarOpen && (
        <button
          type="button"
          className={styles.backdrop}
          aria-label="Close navigation"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className={classNames(styles.main, sidebarOpen && styles.mainDimmed)}>
        <AdminTopbar
          onToggleSidebar={() => setSidebarOpen((v) => !v)}
          sidebarOpen={sidebarOpen}
        />
        <main className={styles.content} id="admin-content">
          <Suspense
            fallback={
              <div className={styles.loading}>
                <Loading label="Loading…" />
              </div>
            }
          >
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  );
}
