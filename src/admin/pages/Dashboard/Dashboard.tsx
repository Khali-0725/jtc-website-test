import { useAuth } from '@/context/AuthContext';
import { useAsync } from '@/hooks';
import { SEO, Button, AnimatedReveal } from '@/components/common';
import {
  sermonService,
  eventService,
  ministryService,
  prayerService,
  contactService,
} from '@/services';
import { formatDate } from '@/utils/dates';
import { AdminPageHeader, StatCard, AdminIcon } from '../../components';
import styles from './Dashboard.module.css';

/* Pull a single snapshot of counts + recent items for the overview.
   Uses list `total` fields rather than fetching whole collections. */
async function loadOverview() {
  const [sermons, upcoming, ministries, prayer, messages, recentSermons] = await Promise.all([
    sermonService.list({ pageSize: 1 }),
    eventService.list({ upcomingOnly: true, pageSize: 5 }),
    ministryService.list(),
    prayerService.list({ handled: false, pageSize: 1 }),
    contactService.list({ handled: false, pageSize: 1 }),
    sermonService.list({ pageSize: 5 }),
  ]);
  return {
    sermonCount: sermons.total,
    upcomingCount: upcoming.total,
    upcomingEvents: upcoming.items,
    ministryCount: ministries.length,
    pendingPrayer: prayer.total,
    unreadMessages: messages.total,
    recentSermons: recentSermons.items,
  };
}

export default function DashboardPage() {
  const { user, hasPermission } = useAuth();
  const state = useAsync(loadOverview, []);
  const canWrite = hasPermission('content:write');

  const data = state.data;
  const loading = state.status === 'loading' || state.status === 'idle';
  const firstName = user?.name?.split(' ')[0] ?? 'there';

  return (
    <>
      <SEO title="Dashboard" path="/admin" noindex />
      <AdminPageHeader
        title={`Welcome back, ${firstName}`}
        description="A quick overview of your church content and inbox."
        actions={
          canWrite && (
            <Button to="/admin/sermons" size="sm" leftIcon={<AdminIcon name="plus" size={16} />}>
              New Sermon
            </Button>
          )
        }
      />

      {state.status === 'error' ? (
        <p className={styles.error} role="alert">
          {state.error ?? 'Could not load dashboard data.'}{' '}
          <button type="button" className={styles.retry} onClick={state.reload}>
            Retry
          </button>
        </p>
      ) : (
        <>
          <div className={styles.stats}>
            <StatCard
              label="Sermons"
              value={data?.sermonCount ?? 0}
              icon={<AdminIcon name="play" />}
              to="/admin/sermons"
              loading={loading}
            />
            <StatCard
              label="Upcoming Events"
              value={data?.upcomingCount ?? 0}
              icon={<AdminIcon name="calendar" />}
              to="/admin/events"
              loading={loading}
            />
            <StatCard
              label="Ministries"
              value={data?.ministryCount ?? 0}
              icon={<AdminIcon name="users" />}
              to="/admin/ministries"
              loading={loading}
            />
            <StatCard
              label="Pending Prayer"
              value={data?.pendingPrayer ?? 0}
              icon={<AdminIcon name="heart" />}
              to="/admin/prayer"
              tone={data && data.pendingPrayer > 0 ? 'accent' : 'default'}
              loading={loading}
            />
            <StatCard
              label="Unread Messages"
              value={data?.unreadMessages ?? 0}
              icon={<AdminIcon name="mail" />}
              to="/admin/messages"
              tone={data && data.unreadMessages > 0 ? 'accent' : 'default'}
              loading={loading}
            />
          </div>

          <div className={styles.columns}>
            <AnimatedReveal>
              <section className={styles.panel} aria-labelledby="recent-sermons-h">
                <div className={styles.panelHead}>
                  <h2 id="recent-sermons-h" className={styles.panelTitle}>
                    Recent Sermons
                  </h2>
                  <Button to="/admin/sermons" variant="ghost" size="sm">
                    View all
                  </Button>
                </div>
                {loading ? (
                  <p className={styles.muted}>Loading…</p>
                ) : data && data.recentSermons.length > 0 ? (
                  <ul className={styles.list} role="list">
                    {data.recentSermons.map((s) => (
                      <li key={s.id} className={styles.listItem}>
                        <span className={styles.itemTitle}>{s.title}</span>
                        <span className={styles.itemMeta}>
                          {s.speaker} · {formatDate(s.date)}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className={styles.muted}>No sermons yet.</p>
                )}
              </section>
            </AnimatedReveal>

            <AnimatedReveal delay={80}>
              <section className={styles.panel} aria-labelledby="upcoming-events-h">
                <div className={styles.panelHead}>
                  <h2 id="upcoming-events-h" className={styles.panelTitle}>
                    Upcoming Events
                  </h2>
                  <Button to="/admin/events" variant="ghost" size="sm">
                    View all
                  </Button>
                </div>
                {loading ? (
                  <p className={styles.muted}>Loading…</p>
                ) : data && data.upcomingEvents.length > 0 ? (
                  <ul className={styles.list} role="list">
                    {data.upcomingEvents.map((e) => (
                      <li key={e.id} className={styles.listItem}>
                        <span className={styles.itemTitle}>{e.title}</span>
                        <span className={styles.itemMeta}>
                          {formatDate(e.startDate)} · {e.locationName}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className={styles.muted}>No upcoming events.</p>
                )}
              </section>
            </AnimatedReveal>
          </div>

          {canWrite && (
            <section className={styles.quick} aria-label="Quick actions">
              <Button to="/admin/events" variant="outline" size="sm">
                Add event
              </Button>
              <Button to="/admin/ministries" variant="outline" size="sm">
                Add ministry
              </Button>
              <Button to="/admin/announcements" variant="outline" size="sm">
                Post announcement
              </Button>
              <Button to="/admin/staff" variant="outline" size="sm">
                Add staff
              </Button>
            </section>
          )}
        </>
      )}
    </>
  );
}
