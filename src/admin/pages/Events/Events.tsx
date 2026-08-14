import { useMemo, useState } from 'react';
import type { ChurchEvent } from '@/types';
import { eventService } from '@/services';
import { useAsync, useDebounce } from '@/hooks';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { SEO, Button, Modal, Pagination, EmptyState } from '@/components/common';
import { formatDate, isUpcoming } from '@/utils/dates';
import {
  AdminPageHeader,
  DataTable,
  StatusBadge,
  ConfirmDialog,
  AdminIcon,
  Input,
} from '../../components';
import type { Column } from '../../components';
import { EventForm } from './EventForm';
import styles from './Events.module.css';

const PAGE_SIZE = 10;

export default function AdminEventsPage() {
  const { hasPermission } = useAuth();
  const { notify } = useToast();
  const canWrite = hasPermission('content:write');
  const canDelete = hasPermission('content:delete');

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const debounced = useDebounce(search, 300);

  const query = useMemo(
    () => ({ search: debounced || undefined, page, pageSize: PAGE_SIZE }),
    [debounced, page],
  );
  const state = useAsync(() => eventService.list(query), [debounced, page]);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<ChurchEvent | null>(null);
  const [toDelete, setToDelete] = useState<ChurchEvent | null>(null);
  const [deleting, setDeleting] = useState(false);

  function openCreate() {
    setEditing(null);
    setFormOpen(true);
  }
  function openEdit(ev: ChurchEvent) {
    setEditing(ev);
    setFormOpen(true);
  }
  function handleSuccess() {
    setFormOpen(false);
    setEditing(null);
    state.reload();
  }

  async function confirmDelete() {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await eventService.remove(toDelete.slug);
      notify('Event deleted.', 'success');
      setToDelete(null);
      state.reload();
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Could not delete event.', 'error');
    } finally {
      setDeleting(false);
    }
  }

  const columns: Column<ChurchEvent>[] = [
    { key: 'title', header: 'Title', render: (e) => <span className={styles.strong}>{e.title}</span> },
    { key: 'category', header: 'Category', render: (e) => <StatusBadge>{e.category}</StatusBadge> },
    { key: 'startDate', header: 'Date', render: (e) => formatDate(e.startDate) },
    {
      key: 'upcoming',
      header: 'When',
      render: (e) =>
        isUpcoming(e.startDate) ? (
          <StatusBadge tone="accent">Upcoming</StatusBadge>
        ) : (
          <StatusBadge tone="neutral">Past</StatusBadge>
        ),
    },
  ];

  return (
    <>
      <SEO title="Events · Admin" path="/admin/events" noindex />
      <AdminPageHeader
        title="Events"
        description="Manage church events and gatherings."
        actions={
          canWrite && (
            <Button size="sm" onClick={openCreate} leftIcon={<AdminIcon name="plus" size={16} />}>
              New Event
            </Button>
          )
        }
      />

      <div className={styles.toolbar}>
        <Input
          type="search"
          aria-label="Search events"
          placeholder="Search events…"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className={styles.search}
        />
      </div>

      <DataTable
        columns={columns}
        rows={state.data?.items ?? []}
        rowKey={(e) => e.id}
        loading={state.status === 'loading' || state.status === 'idle'}
        error={state.status === 'error' ? state.error : null}
        onRetry={state.reload}
        empty={<EmptyState title="No events found" message="Try a different search, or add one." />}
        actions={
          canWrite || canDelete
            ? (ev) => (
                <>
                  {canWrite && (
                    <Button variant="ghost" size="sm" onClick={() => openEdit(ev)}>
                      Edit
                    </Button>
                  )}
                  {canDelete && (
                    <Button variant="ghost" size="sm" onClick={() => setToDelete(ev)}>
                      Delete
                    </Button>
                  )}
                </>
              )
            : undefined
        }
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

      <Modal
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        title={editing ? 'Edit Event' : 'New Event'}
      >
        <EventForm initial={editing} onSuccess={handleSuccess} onCancel={() => setFormOpen(false)} />
      </Modal>

      <ConfirmDialog
        isOpen={Boolean(toDelete)}
        title="Delete event?"
        message={`"${toDelete?.title ?? ''}" will be permanently removed. This cannot be undone.`}
        confirmLabel="Delete"
        danger
        loading={deleting}
        onConfirm={confirmDelete}
        onClose={() => setToDelete(null)}
      />
    </>
  );
}
