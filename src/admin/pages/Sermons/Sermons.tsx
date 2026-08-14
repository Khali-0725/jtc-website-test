import { useMemo, useState } from 'react';
import type { Sermon } from '@/types';
import { sermonService } from '@/services';
import { useAsync, useDebounce } from '@/hooks';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { SEO, Button, Modal, Pagination, EmptyState } from '@/components/common';
import { formatDate } from '@/utils/dates';
import {
  AdminPageHeader,
  DataTable,
  StatusBadge,
  ConfirmDialog,
  AdminIcon,
  Input,
} from '../../components';
import type { Column } from '../../components';
import { SermonForm } from './SermonForm';
import styles from './Sermons.module.css';

const PAGE_SIZE = 10;

export default function AdminSermonsPage() {
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
  const state = useAsync(() => sermonService.list(query), [debounced, page]);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Sermon | null>(null);
  const [toDelete, setToDelete] = useState<Sermon | null>(null);
  const [deleting, setDeleting] = useState(false);

  function openCreate() {
    setEditing(null);
    setFormOpen(true);
  }
  function openEdit(sermon: Sermon) {
    setEditing(sermon);
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
      await sermonService.remove(toDelete.slug);
      notify('Sermon deleted.', 'success');
      setToDelete(null);
      state.reload();
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Could not delete sermon.', 'error');
    } finally {
      setDeleting(false);
    }
  }

  const columns: Column<Sermon>[] = [
    { key: 'title', header: 'Title', render: (s) => <span className={styles.strong}>{s.title}</span> },
    { key: 'speaker', header: 'Speaker' },
    { key: 'series', header: 'Series', render: (s) => s.series ?? '—' },
    { key: 'date', header: 'Date', render: (s) => formatDate(s.date) },
    {
      key: 'published',
      header: 'Status',
      render: (s) => {
        const published = (s as { published?: boolean }).published ?? true;
        return published ? (
          <StatusBadge tone="success">Published</StatusBadge>
        ) : (
          <StatusBadge tone="neutral">Draft</StatusBadge>
        );
      },
    },
  ];

  return (
    <>
      <SEO title="Sermons · Admin" path="/admin/sermons" noindex />
      <AdminPageHeader
        title="Sermons"
        description="Create, edit, and organize sermon messages."
        actions={
          canWrite && (
            <Button size="sm" onClick={openCreate} leftIcon={<AdminIcon name="plus" size={16} />}>
              New Sermon
            </Button>
          )
        }
      />

      <div className={styles.toolbar}>
        <Input
          type="search"
          aria-label="Search sermons"
          placeholder="Search sermons…"
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
        rowKey={(s) => s.id}
        loading={state.status === 'loading' || state.status === 'idle'}
        error={state.status === 'error' ? state.error : null}
        onRetry={state.reload}
        empty={<EmptyState title="No sermons found" message="Try a different search, or add one." />}
        actions={
          canWrite || canDelete
            ? (s) => (
                <>
                  {canWrite && (
                    <Button variant="ghost" size="sm" onClick={() => openEdit(s)}>
                      Edit
                    </Button>
                  )}
                  {canDelete && (
                    <Button variant="ghost" size="sm" onClick={() => setToDelete(s)}>
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
        title={editing ? 'Edit Sermon' : 'New Sermon'}
      >
        <SermonForm
          initial={editing}
          onSuccess={handleSuccess}
          onCancel={() => setFormOpen(false)}
        />
      </Modal>

      <ConfirmDialog
        isOpen={Boolean(toDelete)}
        title="Delete sermon?"
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
