import { useState } from 'react';
import type { FormEvent } from 'react';
import type { Announcement } from '@/types';
import { announcementService } from '@/services';
import type { AnnouncementInput } from '@/services/announcementService';
import { useToast } from '@/context/ToastContext';
import { Button } from '@/components/common';
import { FormField, FormRow, FormActions, Input, TextArea, Checkbox } from '../../components';

interface AnnouncementFormProps {
  initial?: Announcement | null;
  onSuccess: () => void;
  onCancel: () => void;
}

type Errors = Partial<Record<'title' | 'body' | 'date', string>>;

/* Backend model is title/body/date/link/active — there is no priority or
   scheduled window, so only these fields are exposed. */
export function AnnouncementForm({ initial, onSuccess, onCancel }: AnnouncementFormProps) {
  const { notify } = useToast();
  const editing = Boolean(initial);

  const [title, setTitle] = useState(initial?.title ?? '');
  const [body, setBody] = useState(initial?.body ?? '');
  const [date, setDate] = useState(initial?.date?.slice(0, 10) ?? '');
  const [link, setLink] = useState(initial?.link ?? '');
  const [active, setActive] = useState<boolean>(
    (initial as { active?: boolean } | null)?.active ?? true,
  );

  const [errors, setErrors] = useState<Errors>({});
  const [saving, setSaving] = useState(false);

  function validate(): boolean {
    const next: Errors = {};
    if (!title.trim()) next.title = 'Title is required.';
    if (!body.trim()) next.body = 'Body is required.';
    if (!date.trim()) next.date = 'Date is required.';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    const payload: AnnouncementInput = {
      title: title.trim(),
      body: body.trim(),
      date: date.trim(),
      link: link.trim() || undefined,
      active,
    };

    setSaving(true);
    try {
      if (editing && initial) {
        await announcementService.update(initial.id, payload);
        notify('Announcement updated.', 'success');
      } else {
        await announcementService.create(payload);
        notify('Announcement created.', 'success');
      }
      onSuccess();
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Could not save announcement.', 'error');
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <FormField label="Title" htmlFor="a-title" error={errors.title} required>
        <Input id="a-title" value={title} onChange={(e) => setTitle(e.target.value)} required />
      </FormField>

      <FormRow>
        <FormField label="Date" htmlFor="a-date" error={errors.date} required>
          <Input
            id="a-date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </FormField>
        <FormField label="Link" htmlFor="a-link" hint="Optional call-to-action URL.">
          <Input id="a-link" value={link} onChange={(e) => setLink(e.target.value)} />
        </FormField>
      </FormRow>

      <FormField label="Body" htmlFor="a-body" error={errors.body} required>
        <TextArea id="a-body" rows={5} value={body} onChange={(e) => setBody(e.target.value)} />
      </FormField>

      <FormField label="Visibility" htmlFor="a-active">
        <Checkbox
          id="a-active"
          label="Active (visible on the public site)"
          checked={active}
          onChange={(e) => setActive(e.target.checked)}
        />
      </FormField>

      <FormActions>
        <Button type="button" variant="ghost" onClick={onCancel} disabled={saving}>
          Cancel
        </Button>
        <Button type="submit" disabled={saving}>
          {saving ? 'Saving…' : editing ? 'Save changes' : 'Create announcement'}
        </Button>
      </FormActions>
    </form>
  );
}
