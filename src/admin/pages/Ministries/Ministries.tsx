import { useMemo, useState } from 'react';
import type { Ministry } from '@/types';
import { ministryService } from '@/services';
import { useAsync, useDebounce } from '@/hooks';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { SEO, Button, Modal, EmptyState } from '@/components/common';
import {
  AdminPageHeader,
  DataTable,
  StatusBadge,
  ConfirmDialog,
  AdminIcon,
  Input,
} from '../../components';
import type { Column } from '../../components';
import { MinistryForm } from './MinistryForm';
import styles from './Ministries.module.css';

export default function AdminMinistriesPage() {
  const { hasPermission } = useAuth();
  const { notify } = useToast();
  const canWrite = hasPermission('content:write');
  const canDelete = hasPermission('content:delete');

  const [search, setSearch] = useState('');
  const debounced = useDebounce(search, 250);
  const state = useAsync(() => ministryService.list(), []);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Ministry | null>(null);
  const [toDelete, setToDelete] = useState<Ministry | null>(null);
  const [deleting, setDeleting] = useState(false);

  const rows = useMemo(() => {
    const list = state.data ?? [];
    const q = debounced.trim().toLowerCase();
    if (!q) return list;
    return list.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.tagline.toLowerCase().includes(q) ||
        m.category.toLowerCase().includes(q),
    );
  }, [state.data, debounced]);

  function openCreate() {
    setEditing(null);
    setFormOpen(true);
  }
  function openEdit(m: Ministry) {
    setEditing(m);
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
      await ministryService.remove(toDelete.slug);
      notify('Ministry deleted.', 'success');
      setToDelete(null);
      state.reload();
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Could not delete ministry.', 'error');
    } finally {
      setDeleting(false);
    }
  }

  const columns: Column<Ministry>[] = [
    { key: 'name', header: 'Name', render: (m) => <span className={styles.strong}>{m.name}</span> },
    { key: 'category', header: 'Category', render: (m) => <StatusBadge>{m.category}</StatusBadge> },
    { key: 'tagline', header: 'Tagline' },
    { key: 'location', header: 'Location', render: (m) => m.location || '—' },
  ];

  return (
    <>
      <SEO title="Ministries · Admin" path="/admin/ministries" noindex />
      <AdminPageHeader
        title="Ministries"
        description="Manage ministries and small groups."
        actions={
          canWrite && (
            <Button size="sm" onClick={openCreate} leftIcon={<AdminIcon name="plus" size={16} />}>
              New Ministry
            </Button>
          )
        }
      />

      <div className={styles.toolbar}>
        <Input
          type="search"
          aria-label="Search ministries"
          placeholder="Search ministries…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={styles.search}
        />
      </div>

      <DataTable
        columns={columns}
        rows={rows}
        rowKey={(m) => m.id}
        loading={state.status === 'loading' || state.status === 'idle'}
        error={state.status === 'error' ? state.error : null}
        onRetry={state.reload}
        empty={<EmptyState title="No ministries found" message="Try a different search, or add one." />}
        actions={
          canWrite || canDelete
            ? (m) => (
                <>
                  {canWrite && (
                    <Button variant="ghost" size="sm" onClick={() => openEdit(m)}>
                      Edit
                    </Button>
                  )}
                  {canDelete && (
                    <Button variant="ghost" size="sm" onClick={() => setToDelete(m)}>
                      Delete
                    </Button>
                  )}
                </>
              )
            : undefined
        }
      />

      <Modal
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        title={editing ? 'Edit Ministry' : 'New Ministry'}
      >
        <MinistryForm
          initial={editing}
          onSuccess={handleSuccess}
          onCancel={() => setFormOpen(false)}
        />
      </Modal>

      <ConfirmDialog
        isOpen={Boolean(toDelete)}
        title="Delete ministry?"
        message={`"${toDelete?.name ?? ''}" will be permanently removed. This cannot be undone.`}
        confirmLabel="Delete"
        danger
        loading={deleting}
        onConfirm={confirmDelete}
        onClose={() => setToDelete(null)}
      />
    </>
  );
}
