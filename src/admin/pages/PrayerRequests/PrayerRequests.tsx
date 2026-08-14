import { useMemo, useState } from 'react';
import { prayerService } from '@/services';
import type { PrayerRequestRecord } from '@/services/prayerService';
import { useAsync } from '@/hooks';
import { useToast } from '@/context/ToastContext';
import { SEO, Button, Pagination, EmptyState } from '@/components/common';
import { formatDate } from '@/utils/dates';
import { AdminPageHeader, DataTable, StatusBadge } from '../../components';
import type { Column } from '../../components';
import styles from './PrayerRequests.module.css';

const PAGE_SIZE = 20;

export default function AdminPrayerRequestsPage() {
  const { notify } = useToast();

  const [showHandled, setShowHandled] = useState(false);
  const [page, setPage] = useState(1);
  const [busyId, setBusyId] = useState<string | null>(null);

  const query = useMemo(
    () => ({ handled: showHandled ? undefined : false, page, pageSize: PAGE_SIZE }),
    [showHandled, page],
  );
  const state = useAsync(() => prayerService.list(query), [showHandled, page]);

  async function toggleHandled(r: PrayerRequestRecord) {
    setBusyId(r.id);
    try {
      await prayerService.setHandled(r.id, !r.handled);
      notify(r.handled ? 'Marked as unresolved.' : 'Marked as prayed for.', 'success');
      state.reload();
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Could not update request.', 'error');
    } finally {
      setBusyId(null);
    }
  }

  const columns: Column<PrayerRequestRecord>[] = [
    {
      key: 'name',
      header: 'From',
      render: (r) =>
        r.anonymous ? (
          <span className={styles.muted}>Anonymous</span>
        ) : (
          <span className={styles.strong}>{r.name}</span>
        ),
    },
    { key: 'email', header: 'Email', render: (r) => r.email || '—' },
    { key: 'request', header: 'Request', render: (r) => <span className={styles.excerpt}>{r.request}</span> },
    { key: 'createdAt', header: 'Submitted', render: (r) => formatDate(r.createdAt) },
    {
      key: 'handled',
      header: 'Status',
      render: (r) =>
        r.handled ? (
          <StatusBadge tone="success">Prayed for</StatusBadge>
        ) : (
          <StatusBadge tone="warning">Pending</StatusBadge>
        ),
    },
  ];

  return (
    <>
      <SEO title="Prayer Requests · Admin" path="/admin/prayer" noindex />
      <AdminPageHeader
        title="Prayer Requests"
        description="Review and follow up on submitted prayer requests."
        actions={
          <Button
            size="sm"
            variant={showHandled ? 'primary' : 'ghost'}
            onClick={() => {
              setShowHandled((v) => !v);
              setPage(1);
            }}
          >
            {showHandled ? 'Showing all' : 'Show all'}
          </Button>
        }
      />

      <DataTable
        columns={columns}
        rows={state.data?.items ?? []}
        rowKey={(r) => r.id}
        loading={state.status === 'loading' || state.status === 'idle'}
        error={state.status === 'error' ? state.error : null}
        onRetry={state.reload}
        empty={
          <EmptyState
            title="No prayer requests"
            message={showHandled ? 'Nothing has been submitted yet.' : 'No pending requests — all caught up.'}
          />
        }
        actions={(r) => (
          <Button
            variant="ghost"
            size="sm"
            disabled={busyId === r.id}
            onClick={() => toggleHandled(r)}
          >
            {r.handled ? 'Reopen' : 'Mark prayed for'}
          </Button>
        )}
      />

      {state.data && state.data.total > PAGE_SIZE && (
        <div className={styles.pagination}>
          <Pagination
            page={state.data.page}
            pageSize={state.data.pageSize}
            total={state.data.total}
            onPageChange={setPage}
          />
        </div>
      )}
    </>
  );
}
