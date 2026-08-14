import { Suspense, lazy } from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { ToastProvider } from '@/context/ToastContext';
import { SettingsProvider } from '@/context/SettingsContext';
import { Navbar, Footer, PageTransition } from '@/components/layout';
import { Loading } from '@/components/common';
import { AdminLayout, RequireAuth } from '@/admin';

/* Route-level code splitting — each page is its own chunk. */
const Home = lazy(() => import('@/pages/Home'));
const Sermons = lazy(() => import('@/pages/Sermons'));
const SermonDetails = lazy(() => import('@/pages/SermonDetails'));
const Events = lazy(() => import('@/pages/Events'));
const EventDetails = lazy(() => import('@/pages/EventDetails'));
const Ministries = lazy(() => import('@/pages/Ministries'));
const MinistryDetails = lazy(() => import('@/pages/MinistryDetails'));
const About = lazy(() => import('@/pages/About'));
const Locations = lazy(() => import('@/pages/Locations'));
const PlanYourVisit = lazy(() => import('@/pages/PlanYourVisit'));
const Watch = lazy(() => import('@/pages/Watch'));
const Give = lazy(() => import('@/pages/Give'));
const Prayer = lazy(() => import('@/pages/Prayer'));
const Contact = lazy(() => import('@/pages/Contact'));
const SearchPage = lazy(() => import('@/pages/Search'));
const NotFound = lazy(() => import('@/pages/NotFound'));

/* Admin area — separate chunks, own chrome (no public Navbar/Footer). */
const AdminLogin = lazy(() => import('@/admin/pages/Login'));
const AdminDashboard = lazy(() => import('@/admin/pages/Dashboard'));
const AdminSermons = lazy(() => import('@/admin/pages/Sermons'));
const AdminEvents = lazy(() => import('@/admin/pages/Events'));
const AdminMinistries = lazy(() => import('@/admin/pages/Ministries'));
const AdminStaff = lazy(() => import('@/admin/pages/Staff'));
const AdminAnnouncements = lazy(() => import('@/admin/pages/Announcements'));
const AdminPrayer = lazy(() => import('@/admin/pages/PrayerRequests'));
const AdminMessages = lazy(() => import('@/admin/pages/Messages'));
const AdminUsers = lazy(() => import('@/admin/pages/Users'));
const AdminBranding = lazy(() => import('@/admin/pages/Branding'));

function PageFallback() {
  return (
    <div style={{ minHeight: '70vh', display: 'grid', placeItems: 'center' }}>
      <Loading label="Loading…" />
    </div>
  );
}

/* Public site chrome: skip-link + Navbar + Footer wrapping the routed page.
   Navbar/Footer stay mounted across navigation; only the page suspends.
   The admin area deliberately does NOT use this layout. */
function PublicLayout() {
  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <Navbar />
      <main id="main-content">
        <PageTransition>
          <Suspense fallback={<PageFallback />}>
            <Outlet />
          </Suspense>
        </PageTransition>
      </main>
      <Footer />
    </>
  );
}

export function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <SettingsProvider>
          <Routes>
          {/* Public site */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/sermons" element={<Sermons />} />
            <Route path="/sermons/:slug" element={<SermonDetails />} />
            <Route path="/events" element={<Events />} />
            <Route path="/events/:slug" element={<EventDetails />} />
            <Route path="/ministries" element={<Ministries />} />
            <Route path="/ministries/:slug" element={<MinistryDetails />} />
            <Route path="/about" element={<About />} />
            <Route path="/locations" element={<Locations />} />
            <Route path="/plan-your-visit" element={<PlanYourVisit />} />
            <Route path="/watch" element={<Watch />} />
            <Route path="/give" element={<Give />} />
            <Route path="/prayer" element={<Prayer />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="*" element={<NotFound />} />
          </Route>

          {/* Admin sign-in (public, own bare chrome) */}
          <Route
            path="/admin/login"
            element={
              <Suspense fallback={<PageFallback />}>
                <AdminLogin />
              </Suspense>
            }
          />

          {/* Admin area (auth-gated, own sidebar chrome; page suspense
              lives inside AdminLayout so the chrome stays mounted). */}
          <Route
            path="/admin"
            element={
              <RequireAuth>
                <AdminLayout />
              </RequireAuth>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="sermons" element={<AdminSermons />} />
            <Route path="events" element={<AdminEvents />} />
            <Route path="ministries" element={<AdminMinistries />} />
            <Route path="staff" element={<AdminStaff />} />
            <Route path="announcements" element={<AdminAnnouncements />} />
            <Route path="prayer" element={<AdminPrayer />} />
            <Route path="messages" element={<AdminMessages />} />
            <Route
              path="users"
              element={
                <RequireAuth roles={['ADMIN', 'SUPER_ADMIN']}>
                  <AdminUsers />
                </RequireAuth>
              }
            />
            <Route
              path="settings"
              element={
                <RequireAuth roles={['SUPER_ADMIN']}>
                  <AdminBranding />
                </RequireAuth>
              }
            />
          </Route>
        </Routes>
        </SettingsProvider>
      </ToastProvider>
    </AuthProvider>
  );
}
