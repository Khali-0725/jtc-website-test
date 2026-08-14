import { useState } from 'react';
import type { FormEvent } from 'react';
import type { Ministry, MinistryCategory } from '@/types';
import { ministryService } from '@/services';
import type { MinistryInput } from '@/services/ministryService';
import { useToast } from '@/context/ToastContext';
import { Button } from '@/components/common';
import {
  FormField,
  FormRow,
  FormActions,
  Input,
  TextArea,
  Select,
} from '../../components';

const CATEGORIES: MinistryCategory[] = [
  'Kids',
  'Youth',
  'Young Adults',
  'Families',
  'Worship',
  'Small Groups',
  'Prayer',
  'Outreach',
  'Volunteers',
];

interface MinistryFormProps {
  initial?: Ministry | null;
  onSuccess: () => void;
  onCancel: () => void;
}

type Errors = Partial<
  Record<'name' | 'tagline' | 'description' | 'audience' | 'schedule' | 'location' | 'image', string>
>;

export function MinistryForm({ initial, onSuccess, onCancel }: MinistryFormProps) {
  const { notify } = useToast();
  const editing = Boolean(initial);

  const [name, setName] = useState(initial?.name ?? '');
  const [slug, setSlug] = useState(initial?.slug ?? '');
  const [category, setCategory] = useState<MinistryCategory>(initial?.category ?? 'Small Groups');
  const [tagline, setTagline] = useState(initial?.tagline ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [audience, setAudience] = useState(initial?.audience ?? '');
  const [schedule, setSchedule] = useState(initial?.schedule ?? '');
  const [location, setLocation] = useState(initial?.location ?? '');
  const [contactEmail, setContactEmail] = useState(initial?.contactEmail ?? '');
  const [image, setImage] = useState(initial?.image ?? '');

  const [errors, setErrors] = useState<Errors>({});
  const [saving, setSaving] = useState(false);

  function validate(): boolean {
    const next: Errors = {};
    if (!name.trim()) next.name = 'Name is required.';
    if (!tagline.trim()) next.tagline = 'Tagline is required.';
    if (!description.trim()) next.description = 'Description is required.';
    if (!audience.trim()) next.audience = 'Audience is required.';
    if (!schedule.trim()) next.schedule = 'Schedule is required.';
    if (!location.trim()) next.location = 'Location is required.';
    if (!image.trim()) next.image = 'Image URL is required.';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    const payload: MinistryInput = {
      name: name.trim(),
      slug: slug.trim() || undefined,
      category,
      tagline: tagline.trim(),
      description: description.trim(),
      audience: audience.trim(),
      schedule: schedule.trim(),
      location: location.trim(),
      contactEmail: contactEmail.trim() || undefined,
      image: image.trim(),
    };

    setSaving(true);
    try {
      if (editing && initial) {
        await ministryService.update(initial.slug, payload);
        notify('Ministry updated.', 'success');
      } else {
        await ministryService.create(payload);
        notify('Ministry created.', 'success');
      }
      onSuccess();
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Could not save ministry.', 'error');
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <FormRow>
        <FormField label="Name" htmlFor="m-name" error={errors.name} required>
          <Input id="m-name" value={name} onChange={(e) => setName(e.target.value)} required />
        </FormField>
        <FormField label="Category" htmlFor="m-category" required>
          <Select
            id="m-category"
            value={category}
            onChange={(e) => setCategory(e.target.value as MinistryCategory)}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
        </FormField>
      </FormRow>

      <FormField label="Tagline" htmlFor="m-tagline" error={errors.tagline} required>
        <Input id="m-tagline" value={tagline} onChange={(e) => setTagline(e.target.value)} required />
      </FormField>

      <FormRow>
        <FormField label="Audience" htmlFor="m-audience" error={errors.audience} required>
          <Input
            id="m-audience"
            value={audience}
            onChange={(e) => setAudience(e.target.value)}
            required
          />
        </FormField>
        <FormField label="Schedule" htmlFor="m-schedule" error={errors.schedule} required>
          <Input
            id="m-schedule"
            value={schedule}
            onChange={(e) => setSchedule(e.target.value)}
            required
          />
        </FormField>
      </FormRow>

      <FormRow>
        <FormField label="Location" htmlFor="m-location" error={errors.location} required>
          <Input
            id="m-location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
        </FormField>
        <FormField label="Contact email" htmlFor="m-email" hint="Optional">
          <Input
            id="m-email"
            type="email"
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
          />
        </FormField>
      </FormRow>

      <FormRow>
        <FormField label="Image URL" htmlFor="m-image" error={errors.image} required>
          <Input id="m-image" value={image} onChange={(e) => setImage(e.target.value)} required />
        </FormField>
        <FormField label="Slug" htmlFor="m-slug" hint="Leave blank to generate from the name.">
          <Input id="m-slug" value={slug} onChange={(e) => setSlug(e.target.value)} />
        </FormField>
      </FormRow>

      <FormField label="Description" htmlFor="m-desc" error={errors.description} required>
        <TextArea
          id="m-desc"
          rows={5}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </FormField>

      <FormActions>
        <Button type="button" variant="ghost" onClick={onCancel} disabled={saving}>
          Cancel
        </Button>
        <Button type="submit" disabled={saving}>
          {saving ? 'Saving…' : editing ? 'Save changes' : 'Create ministry'}
        </Button>
      </FormActions>
    </form>
  );
}
