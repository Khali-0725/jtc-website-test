import { useMemo, useState } from 'react';
import { contactService } from '@/services';
import type { ContactMessageRecord } from '@/services/contactService';
import { useAsync } from '@/hooks';
import { useToast } from '@/context/ToastContext';
import { SEO, Button, Pagination, EmptyState } from '@/components/common';
import { formatDate } from '@/utils/dates';
import { AdminPageHeader, DataTable, StatusBadge } from '../../components';
import type { Column } from '../../components';
import styles from './Messages.module.css';

const PAGE_SIZE = 20;

export default function AdminMessagesPage() {
  const { notify } = useToast();

  const [showHandled, setShowHandled] = useState(false);
  const [page, setPage] = useState(1);
  const [busyId, setBusyId] = useState<string | null>(null);

  const query = useMemo(
    () => ({ handled: showHandled ? undefined : false, page, pageSize: PAGE_SIZE }),
    [showHandled, page],
  );
  const state = useAsync(() => contactService.list(query), [showHandled, page]);

  async function toggleHandled(m: ContactMessageRecord) {
    setBusyId(m.id);
    try {
      await contactService.setHandled(m.id, !m.handled);
      notify(m.handled ? 'Marked as unread.' : 'Marked as read.', 'success');
      state.reload();
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Could not update message.', 'error');
    } finally {
      setBusyId(null);
    }
  }

  const columns: Column<ContactMessageRecord>[] = [
    { key: 'name', header: 'From', render: (m) => <span className={styles.strong}>{m.name}</span> },
    {
      key: 'email',
      header: 'Email',
      render: (m) => (
        <a className={styles.link} href={`mailto:${m.email}`}>
          {m.email}
        </a>
      ),
    },
    { key: 'subject', header: 'Subject' },
    { key: 'message', header: 'Message', render: (m) => <span className={styles.excerpt}>{m.message}</span> },
    { key: 'createdAt', header: 'Received', render: (m) => formatDate(m.createdAt) },
    {
      key: 'handled',
      header: 'Status',
      render: (m) =>
        m.handled ? (
          <StatusBadge tone="success">Read</StatusBadge>
        ) : (
          <StatusBadge tone="accent">New</StatusBadge>
        ),
    },
  ];

  return (
    <>
      <SEO title="Messages · Admin" path="/admin/messages" noindex />
      <AdminPageHeader
        title="Messages"
        description="Contact form submissions from the public site."
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
        rowKey={(m) => m.id}
        loading={state.status === 'loading' || state.status === 'idle'}
        error={state.status === 'error' ? state.error : null}
        onRetry={state.reload}
        empty={
          <EmptyState
            title="No messages"
            message={showHandled ? 'Nothing has been submitted yet.' : 'No unread messages — all caught up.'}
          />
        }
        actions={(m) => (
          <Button
            variant="ghost"
            size="sm"
            disabled={busyId === m.id}
            onClick={() => toggleHandled(m)}
          >
            {m.handled ? 'Mark unread' : 'Mark read'}
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
