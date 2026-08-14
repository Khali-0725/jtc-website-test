import { useState } from 'react';
import type { FormEvent } from 'react';
import type { UserRole } from '@/types';
import { userService } from '@/services';
import type { AdminUser, CreateUserInput, UpdateUserInput } from '@/services/userService';
import { useToast } from '@/context/ToastContext';
import { Button } from '@/components/common';
import { FormField, FormRow, FormActions, Input, Select, Checkbox } from '../../components';

const ROLES: UserRole[] = ['STAFF', 'EDITOR', 'ADMIN', 'SUPER_ADMIN'];

interface UserFormProps {
  initial?: AdminUser | null;
  onSuccess: () => void;
  onCancel: () => void;
}

type Errors = Partial<Record<'name' | 'email' | 'password', string>>;

export function UserForm({ initial, onSuccess, onCancel }: UserFormProps) {
  const { notify } = useToast();
  const editing = Boolean(initial);

  const [name, setName] = useState(initial?.name ?? '');
  const [email, setEmail] = useState(initial?.email ?? '');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>(initial?.role ?? 'STAFF');
  const [isActive, setIsActive] = useState<boolean>(initial?.isActive ?? true);

  const [errors, setErrors] = useState<Errors>({});
  const [saving, setSaving] = useState(false);

  function validate(): boolean {
    const next: Errors = {};
    if (!name.trim()) next.name = 'Name is required.';
    if (!email.trim()) next.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) next.email = 'Enter a valid email.';
    // Password is required for new users only; optional when editing.
    if (!editing && !password) next.password = 'Password is required.';
    else if (password && password.length < 8) next.password = 'Use at least 8 characters.';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    try {
      if (editing && initial) {
        const payload: UpdateUserInput = {
          name: name.trim(),
          role,
          isActive,
          ...(password ? { password } : {}),
        };
        await userService.update(initial.id, payload);
        notify('User updated.', 'success');
      } else {
        const payload: CreateUserInput = {
          name: name.trim(),
          email: email.trim(),
          password,
          role,
          isActive,
        };
        await userService.create(payload);
        notify('User created.', 'success');
      }
      onSuccess();
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Could not save user.', 'error');
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <FormRow>
        <FormField label="Name" htmlFor="u-name" error={errors.name} required>
          <Input id="u-name" value={name} onChange={(e) => setName(e.target.value)} required />
        </FormField>
        <FormField
          label="Email"
          htmlFor="u-email"
          error={errors.email}
          hint={editing ? 'Email cannot be changed.' : undefined}
          required
        >
          <Input
            id="u-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={editing}
            required
          />
        </FormField>
      </FormRow>

      <FormRow>
        <FormField label="Role" htmlFor="u-role" required>
          <Select id="u-role" value={role} onChange={(e) => setRole(e.target.value as UserRole)}>
            {ROLES.map((r) => (
              <option key={r} value={r}>
                {r.replace('_', ' ')}
              </option>
            ))}
          </Select>
        </FormField>
        <FormField
          label={editing ? 'New password' : 'Password'}
          htmlFor="u-password"
          error={errors.password}
          hint={editing ? 'Leave blank to keep the current password.' : 'At least 8 characters.'}
          required={!editing}
        >
          <Input
            id="u-password"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </FormField>
      </FormRow>

      <FormField label="Access" htmlFor="u-active">
        <Checkbox
          id="u-active"
          label="Active (can sign in)"
          checked={isActive}
          onChange={(e) => setIsActive(e.target.checked)}
        />
      </FormField>

      <FormActions>
        <Button type="button" variant="ghost" onClick={onCancel} disabled={saving}>
          Cancel
        </Button>
        <Button type="submit" disabled={saving}>
          {saving ? 'Saving…' : editing ? 'Save changes' : 'Create user'}
        </Button>
      </FormActions>
    </form>
  );
}
