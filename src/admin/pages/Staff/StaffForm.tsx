import { useState } from 'react';
import type { FormEvent } from 'react';
import type { StaffMember } from '@/types';
import { staffService } from '@/services';
import type { StaffInput } from '@/services/staffService';
import { useToast } from '@/context/ToastContext';
import { Button } from '@/components/common';
import { FormField, FormRow, FormActions, Input, TextArea } from '../../components';

interface StaffFormProps {
  initial?: StaffMember | null;
  onSuccess: () => void;
  onCancel: () => void;
}

type Errors = Partial<Record<'name' | 'role', string>>;

export function StaffForm({ initial, onSuccess, onCancel }: StaffFormProps) {
  const { notify } = useToast();
  const editing = Boolean(initial);

  const [name, setName] = useState(initial?.name ?? '');
  const [role, setRole] = useState(initial?.role ?? '');
  const [photo, setPhoto] = useState(initial?.photo ?? '');
  const [bio, setBio] = useState(initial?.bio ?? '');
  const [order, setOrder] = useState(initial?.order != null ? String(initial.order) : '');

  const [errors, setErrors] = useState<Errors>({});
  const [saving, setSaving] = useState(false);

  function validate(): boolean {
    const next: Errors = {};
    if (!name.trim()) next.name = 'Name is required.';
    if (!role.trim()) next.role = 'Role is required.';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    const parsedOrder = order.trim() ? Number(order.trim()) : undefined;
    const payload: StaffInput = {
      name: name.trim(),
      role: role.trim(),
      photo: photo.trim() || undefined,
      bio: bio.trim() || undefined,
      order: Number.isFinite(parsedOrder) ? parsedOrder : undefined,
    };

    setSaving(true);
    try {
      if (editing && initial) {
        await staffService.update(initial.id, payload);
        notify('Staff member updated.', 'success');
      } else {
        await staffService.create(payload);
        notify('Staff member created.', 'success');
      }
      onSuccess();
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Could not save staff member.', 'error');
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <FormRow>
        <FormField label="Name" htmlFor="s-name" error={errors.name} required>
          <Input id="s-name" value={name} onChange={(e) => setName(e.target.value)} required />
        </FormField>
        <FormField label="Role" htmlFor="s-role" error={errors.role} required>
          <Input id="s-role" value={role} onChange={(e) => setRole(e.target.value)} required />
        </FormField>
      </FormRow>

      <FormRow>
        <FormField label="Photo URL" htmlFor="s-photo" hint="Optional">
          <Input id="s-photo" value={photo} onChange={(e) => setPhoto(e.target.value)} />
        </FormField>
        <FormField label="Display order" htmlFor="s-order" hint="Lower numbers appear first.">
          <Input
            id="s-order"
            type="number"
            min={0}
            value={order}
            onChange={(e) => setOrder(e.target.value)}
          />
        </FormField>
      </FormRow>

      <FormField label="Bio" htmlFor="s-bio" hint="Optional">
        <TextArea id="s-bio" rows={4} value={bio} onChange={(e) => setBio(e.target.value)} />
      </FormField>

      <FormActions>
        <Button type="button" variant="ghost" onClick={onCancel} disabled={saving}>
          Cancel
        </Button>
        <Button type="submit" disabled={saving}>
          {saving ? 'Saving…' : editing ? 'Save changes' : 'Add staff member'}
        </Button>
      </FormActions>
    </form>
  );
}
