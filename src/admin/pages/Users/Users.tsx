import { useMemo, useState } from 'react';
import type { UserRole } from '@/types';
import { userService } from '@/services';
import type { AdminUser } from '@/services/userService';
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
import { UserForm } from './UserForm';
import styles from './Users.module.css';

const PAGE_SIZE = 20;

const roleTone: Record<UserRole, 'accent' | 'success' | 'warning' | 'neutral'> = {
  SUPER_ADMIN: 'accent',
  ADMIN: 'success',
  EDITOR: 'warning',
  STAFF: 'neutral',
};

export default function AdminUsersPage() {
  const { user: current, hasPermission } = useAuth();
  const { notify } = useToast();
  const canWrite = hasPermission('users:write');

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const debounced = useDebounce(search, 300);

  const query = useMemo(() => ({ page, pageSize: PAGE_SIZE }), [page]);
  const state = useAsync(() => userService.list(query), [page]);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<AdminUser | null>(null);
  const [toDelete, setToDelete] = useState<AdminUser | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  const rows = useMemo(() => {
    const list = state.data?.items ?? [];
    const q = debounced.trim().toLowerCase();
    if (!q) return list;
    return list.filter(
      (u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q),
    );
  }, [state.data, debounced]);

  function openCreate() {
    setEditing(null);
    setFormOpen(true);
  }
  function openEdit(u: AdminUser) {
    setEditing(u);
    setFormOpen(true);
  }
  function handleSuccess() {
    setFormOpen(false);
    setEditing(null);
    state.reload();
  }

  async function toggleActive(u: AdminUser) {
    setBusyId(u.id);
    try {
      await userService.update(u.id, { isActive: !u.isActive });
      notify(u.isActive ? 'User deactivated.' : 'User activated.', 'success');
      state.reload();
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Could not update user.', 'error');
    } finally {
      setBusyId(null);
    }
  }

  async function confirmDelete() {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await userService.remove(toDelete.id);
      notify('User deleted.', 'success');
      setToDelete(null);
      state.reload();
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Could not delete user.', 'error');
    } finally {
      setDeleting(false);
    }
  }

  const columns: Column<AdminUser>[] = [
    { key: 'name', header: 'Name', render: (u) => <span className={styles.strong}>{u.name}</span> },
    { key: 'email', header: 'Email' },
    {
      key: 'role',
      header: 'Role',
      render: (u) => <StatusBadge tone={roleTone[u.role]}>{u.role.replace('_', ' ')}</StatusBadge>,
    },
    {
      key: 'isActive',
      header: 'Status',
      render: (u) =>
        u.isActive ? (
          <StatusBadge tone="success">Active</StatusBadge>
        ) : (
          <StatusBadge tone="danger">Inactive</StatusBadge>
        ),
    },
    {
      key: 'lastLoginAt',
      header: 'Last login',
      render: (u) => (u.lastLoginAt ? formatDate(u.lastLoginAt) : 'Never'),
    },
  ];

  return (
    <>
      <SEO title="Users · Admin" path="/admin/users" noindex />
      <AdminPageHeader
        title="Users"
        description="Manage back-office accounts and access levels."
        actions={
          canWrite && (
            <Button size="sm" onClick={openCreate} leftIcon={<AdminIcon name="plus" size={16} />}>
              New User
            </Button>
          )
        }
      />

      <div className={styles.toolbar}>
        <Input
          type="search"
          aria-label="Search users"
          placeholder="Search users…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={styles.search}
        />
      </div>

      <DataTable
        columns={columns}
        rows={rows}
        rowKey={(u) => u.id}
        loading={state.status === 'loading' || state.status === 'idle'}
        error={state.status === 'error' ? state.error : null}
        onRetry={state.reload}
        empty={<EmptyState title="No users found" message="Try a different search, or add one." />}
        actions={
          canWrite
            ? (u) => {
                const isSelf = current?.id === u.id;
                return (
                  <>
                    <Button variant="ghost" size="sm" onClick={() => openEdit(u)}>
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={isSelf || busyId === u.id}
                      onClick={() => toggleActive(u)}
                    >
                      {u.isActive ? 'Deactivate' : 'Activate'}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={isSelf}
                      onClick={() => setToDelete(u)}
                    >
                      Delete
                    </Button>
                  </>
                );
              }
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
        title={editing ? 'Edit User' : 'New User'}
      >
        <UserForm initial={editing} onSuccess={handleSuccess} onCancel={() => setFormOpen(false)} />
      </Modal>

      <ConfirmDialog
        isOpen={Boolean(toDelete)}
        title="Delete user?"
        message={`"${toDelete?.name ?? ''}" will lose all access. This cannot be undone.`}
        confirmLabel="Delete"
        danger
        loading={deleting}
        onConfirm={confirmDelete}
        onClose={() => setToDelete(null)}
      />
    </>
  );
}
