import { useMemo, useState } from 'react';
import type { StaffMember } from '@/types';
import { staffService } from '@/services';
import { useAsync, useDebounce } from '@/hooks';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { SEO, Button, Modal, EmptyState } from '@/components/common';
import {
  AdminPageHeader,
  DataTable,
  ConfirmDialog,
  AdminIcon,
  Input,
} from '../../components';
import type { Column } from '../../components';
import { StaffForm } from './StaffForm';
import styles from './Staff.module.css';

export default function AdminStaffPage() {
  const { hasPermission } = useAuth();
  const { notify } = useToast();
  const canWrite = hasPermission('content:write');
  const canDelete = hasPermission('content:delete');

  const [search, setSearch] = useState('');
  const debounced = useDebounce(search, 250);
  const state = useAsync(() => staffService.list(), []);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<StaffMember | null>(null);
  const [toDelete, setToDelete] = useState<StaffMember | null>(null);
  const [deleting, setDeleting] = useState(false);

  const rows = useMemo(() => {
    const list = state.data ?? [];
    const q = debounced.trim().toLowerCase();
    if (!q) return list;
    return list.filter(
      (s) => s.name.toLowerCase().includes(q) || s.role.toLowerCase().includes(q),
    );
  }, [state.data, debounced]);

  function openCreate() {
    setEditing(null);
    setFormOpen(true);
  }
  function openEdit(s: StaffMember) {
    setEditing(s);
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
      await staffService.remove(toDelete.id);
      notify('Staff member removed.', 'success');
      setToDelete(null);
      state.reload();
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Could not remove staff member.', 'error');
    } finally {
      setDeleting(false);
    }
  }

  const columns: Column<StaffMember>[] = [
    { key: 'name', header: 'Name', render: (s) => <span className={styles.strong}>{s.name}</span> },
    { key: 'role', header: 'Role' },
    { key: 'order', header: 'Order', align: 'right', render: (s) => s.order ?? '—' },
  ];

  return (
    <>
      <SEO title="Staff · Admin" path="/admin/staff" noindex />
      <AdminPageHeader
        title="Staff"
        description="Manage staff and leadership profiles."
        actions={
          canWrite && (
            <Button size="sm" onClick={openCreate} leftIcon={<AdminIcon name="plus" size={16} />}>
              New Staff Member
            </Button>
          )
        }
      />

      <div className={styles.toolbar}>
        <Input
          type="search"
          aria-label="Search staff"
          placeholder="Search staff…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={styles.search}
        />
      </div>

      <DataTable
        columns={columns}
        rows={rows}
        rowKey={(s) => s.id}
        loading={state.status === 'loading' || state.status === 'idle'}
        error={state.status === 'error' ? state.error : null}
        onRetry={state.reload}
        empty={<EmptyState title="No staff found" message="Try a different search, or add one." />}
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

      <Modal
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        title={editing ? 'Edit Staff Member' : 'New Staff Member'}
      >
        <StaffForm initial={editing} onSuccess={handleSuccess} onCancel={() => setFormOpen(false)} />
      </Modal>

      <ConfirmDialog
        isOpen={Boolean(toDelete)}
        title="Remove staff member?"
        message={`"${toDelete?.name ?? ''}" will be permanently removed. This cannot be undone.`}
        confirmLabel="Remove"
        danger
        loading={deleting}
        onConfirm={confirmDelete}
        onClose={() => setToDelete(null)}
      />
    </>
  );
}
