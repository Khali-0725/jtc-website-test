import { useMemo, useState } from 'react';
import type { Announcement } from '@/types';
import { announcementService } from '@/services';
import { useAsync, useDebounce } from '@/hooks';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { SEO, Button, Modal, EmptyState } from '@/components/common';
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
import { AnnouncementForm } from './AnnouncementForm';
import styles from './Announcements.module.css';

function isActive(a: Announcement): boolean {
  return (a as { active?: boolean }).active ?? true;
}

export default function AdminAnnouncementsPage() {
  const { hasPermission } = useAuth();
  const { notify } = useToast();
  const canWrite = hasPermission('content:write');
  const canDelete = hasPermission('content:delete');

  const [search, setSearch] = useState('');
  const debounced = useDebounce(search, 250);
  // Editors see the full set (active + inactive).
  const state = useAsync(() => announcementService.list(true), []);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Announcement | null>(null);
  const [toDelete, setToDelete] = useState<Announcement | null>(null);
  const [deleting, setDeleting] = useState(false);

  const rows = useMemo(() => {
    const list = state.data ?? [];
    const q = debounced.trim().toLowerCase();
    if (!q) return list;
    return list.filter(
      (a) => a.title.toLowerCase().includes(q) || a.body.toLowerCase().includes(q),
    );
  }, [state.data, debounced]);

  function openCreate() {
    setEditing(null);
    setFormOpen(true);
  }
  function openEdit(a: Announcement) {
    setEditing(a);
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
      await announcementService.remove(toDelete.id);
      notify('Announcement deleted.', 'success');
      setToDelete(null);
      state.reload();
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Could not delete announcement.', 'error');
    } finally {
      setDeleting(false);
    }
  }

  const columns: Column<Announcement>[] = [
    { key: 'title', header: 'Title', render: (a) => <span className={styles.strong}>{a.title}</span> },
    { key: 'date', header: 'Date', render: (a) => formatDate(a.date) },
    {
      key: 'status',
      header: 'Status',
      render: (a) =>
        isActive(a) ? (
          <StatusBadge tone="success">Active</StatusBadge>
        ) : (
          <StatusBadge tone="neutral">Hidden</StatusBadge>
        ),
    },
  ];

  return (
    <>
      <SEO title="Announcements · Admin" path="/admin/announcements" noindex />
      <AdminPageHeader
        title="Announcements"
        description="Manage site-wide announcements."
        actions={
          canWrite && (
            <Button size="sm" onClick={openCreate} leftIcon={<AdminIcon name="plus" size={16} />}>
              New Announcement
            </Button>
          )
        }
      />

      <div className={styles.toolbar}>
        <Input
          type="search"
          aria-label="Search announcements"
          placeholder="Search announcements…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={styles.search}
        />
      </div>

      <DataTable
        columns={columns}
        rows={rows}
        rowKey={(a) => a.id}
        loading={state.status === 'loading' || state.status === 'idle'}
        error={state.status === 'error' ? state.error : null}
        onRetry={state.reload}
        empty={
          <EmptyState title="No announcements found" message="Try a different search, or add one." />
        }
        actions={
          canWrite || canDelete
            ? (a) => (
                <>
                  {canWrite && (
                    <Button variant="ghost" size="sm" onClick={() => openEdit(a)}>
                      Edit
                    </Button>
                  )}
                  {canDelete && (
                    <Button variant="ghost" size="sm" onClick={() => setToDelete(a)}>
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
        title={editing ? 'Edit Announcement' : 'New Announcement'}
      >
        <AnnouncementForm
          initial={editing}
          onSuccess={handleSuccess}
          onCancel={() => setFormOpen(false)}
        />
      </Modal>

      <ConfirmDialog
        isOpen={Boolean(toDelete)}
        title="Delete announcement?"
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
