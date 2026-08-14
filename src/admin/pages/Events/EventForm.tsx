import { useState } from 'react';
import type { FormEvent } from 'react';
import type { ChurchEvent, EventCategory } from '@/types';
import { eventService } from '@/services';
import type { EventInput } from '@/services/eventService';
import { useToast } from '@/context/ToastContext';
import { Button } from '@/components/common';
import {
  FormField,
  FormRow,
  FormActions,
  Input,
  TextArea,
  Select,
  Checkbox,
} from '../../components';

const CATEGORIES: EventCategory[] = [
  'Worship',
  'Conference',
  'Outreach',
  'Youth',
  'Kids',
  'Prayer',
  'Community',
  'Special',
];

interface EventFormProps {
  initial?: ChurchEvent | null;
  onSuccess: () => void;
  onCancel: () => void;
}

type Errors = Partial<
  Record<'title' | 'description' | 'startDate' | 'time' | 'locationName' | 'image', string>
>;

export function EventForm({ initial, onSuccess, onCancel }: EventFormProps) {
  const { notify } = useToast();
  const editing = Boolean(initial);

  const [title, setTitle] = useState(initial?.title ?? '');
  const [slug, setSlug] = useState(initial?.slug ?? '');
  const [category, setCategory] = useState<EventCategory>(initial?.category ?? 'Worship');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [startDate, setStartDate] = useState(initial?.startDate?.slice(0, 10) ?? '');
  const [endDate, setEndDate] = useState(initial?.endDate?.slice(0, 10) ?? '');
  const [time, setTime] = useState(initial?.time ?? '');
  const [locationName, setLocationName] = useState(initial?.locationName ?? '');
  const [address, setAddress] = useState(initial?.address ?? '');
  const [image, setImage] = useState(initial?.image ?? '');
  const [registrationUrl, setRegistrationUrl] = useState(initial?.registrationUrl ?? '');
  const [featured, setFeatured] = useState(initial?.featured ?? false);

  const [errors, setErrors] = useState<Errors>({});
  const [saving, setSaving] = useState(false);

  function validate(): boolean {
    const next: Errors = {};
    if (!title.trim()) next.title = 'Title is required.';
    if (!description.trim()) next.description = 'Description is required.';
    if (!startDate) next.startDate = 'Start date is required.';
    if (!time.trim()) next.time = 'Time is required.';
    if (!locationName.trim()) next.locationName = 'Location is required.';
    if (!image.trim()) next.image = 'Image URL is required.';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    const payload: EventInput = {
      title: title.trim(),
      slug: slug.trim() || undefined,
      category,
      description: description.trim(),
      startDate,
      endDate: endDate || undefined,
      time: time.trim(),
      locationName: locationName.trim(),
      address: address.trim() || undefined,
      image: image.trim(),
      registrationUrl: registrationUrl.trim() || undefined,
      featured,
    };

    setSaving(true);
    try {
      if (editing && initial) {
        await eventService.update(initial.slug, payload);
        notify('Event updated.', 'success');
      } else {
        await eventService.create(payload);
        notify('Event created.', 'success');
      }
      onSuccess();
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Could not save event.', 'error');
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <FormField label="Title" htmlFor="e-title" error={errors.title} required>
        <Input id="e-title" value={title} onChange={(e) => setTitle(e.target.value)} required />
      </FormField>

      <FormRow>
        <FormField label="Category" htmlFor="e-category" required>
          <Select
            id="e-category"
            value={category}
            onChange={(e) => setCategory(e.target.value as EventCategory)}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
        </FormField>
        <FormField label="Time" htmlFor="e-time" error={errors.time} hint="e.g. 9:00 AM" required>
          <Input id="e-time" value={time} onChange={(e) => setTime(e.target.value)} required />
        </FormField>
      </FormRow>

      <FormRow>
        <FormField label="Start date" htmlFor="e-start" error={errors.startDate} required>
          <Input
            id="e-start"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </FormField>
        <FormField label="End date" htmlFor="e-end" hint="Optional">
          <Input id="e-end" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        </FormField>
      </FormRow>

      <FormRow>
        <FormField label="Location name" htmlFor="e-loc" error={errors.locationName} required>
          <Input
            id="e-loc"
            value={locationName}
            onChange={(e) => setLocationName(e.target.value)}
            required
          />
        </FormField>
        <FormField label="Address" htmlFor="e-addr" hint="Optional">
          <Input id="e-addr" value={address} onChange={(e) => setAddress(e.target.value)} />
        </FormField>
      </FormRow>

      <FormField
        label="Slug"
        htmlFor="e-slug"
        hint="Leave blank to generate from the title."
      >
        <Input id="e-slug" value={slug} onChange={(e) => setSlug(e.target.value)} />
      </FormField>

      <FormRow>
        <FormField label="Image URL" htmlFor="e-image" error={errors.image} required>
          <Input id="e-image" value={image} onChange={(e) => setImage(e.target.value)} required />
        </FormField>
        <FormField label="Registration URL" htmlFor="e-reg" hint="Optional">
          <Input
            id="e-reg"
            value={registrationUrl}
            onChange={(e) => setRegistrationUrl(e.target.value)}
          />
        </FormField>
      </FormRow>

      <FormField label="Description" htmlFor="e-desc" error={errors.description} required>
        <TextArea
          id="e-desc"
          rows={5}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </FormField>

      <Checkbox
        id="e-featured"
        label="Feature this event"
        checked={featured}
        onChange={(e) => setFeatured(e.target.checked)}
      />

      <FormActions>
        <Button type="button" variant="ghost" onClick={onCancel} disabled={saving}>
          Cancel
        </Button>
        <Button type="submit" disabled={saving}>
          {saving ? 'Saving…' : editing ? 'Save changes' : 'Create event'}
        </Button>
      </FormActions>
    </form>
  );
}
