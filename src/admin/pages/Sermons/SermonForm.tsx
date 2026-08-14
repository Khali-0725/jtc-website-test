import { useState } from 'react';
import type { FormEvent } from 'react';
import type { Sermon } from '@/types';
import { sermonService } from '@/services';
import type { SermonInput } from '@/services/sermonService';
import { useToast } from '@/context/ToastContext';
import { Button } from '@/components/common';
import { FormField, FormRow, FormActions, Input, TextArea, Checkbox } from '../../components';

interface SermonFormProps {
  /* When present the form edits; otherwise it creates. */
  initial?: Sermon | null;
  onSuccess: () => void;
  onCancel: () => void;
}

type Errors = Partial<Record<'title' | 'speaker' | 'date' | 'description' | 'thumbnail', string>>;

export function SermonForm({ initial, onSuccess, onCancel }: SermonFormProps) {
  const { notify } = useToast();
  const editing = Boolean(initial);

  const [title, setTitle] = useState(initial?.title ?? '');
  const [slug, setSlug] = useState(initial?.slug ?? '');
  const [speaker, setSpeaker] = useState(initial?.speaker ?? '');
  const [series, setSeries] = useState(initial?.series ?? '');
  const [date, setDate] = useState(initial?.date?.slice(0, 10) ?? '');
  const [duration, setDuration] = useState(String(initial?.durationMinutes ?? 30));
  const [thumbnail, setThumbnail] = useState(initial?.thumbnail ?? '');
  const [videoUrl, setVideoUrl] = useState(initial?.videoUrl ?? '');
  const [audioUrl, setAudioUrl] = useState(initial?.audioUrl ?? '');
  const [scripture, setScripture] = useState(initial?.scripture ?? '');
  const [tags, setTags] = useState((initial?.tags ?? []).join(', '));
  const [description, setDescription] = useState(initial?.description ?? '');
  const [featured, setFeatured] = useState(initial?.featured ?? false);

  const [errors, setErrors] = useState<Errors>({});
  const [saving, setSaving] = useState(false);

  function validate(): boolean {
    const next: Errors = {};
    if (!title.trim()) next.title = 'Title is required.';
    if (!speaker.trim()) next.speaker = 'Speaker is required.';
    if (!date) next.date = 'Date is required.';
    if (!description.trim()) next.description = 'Description is required.';
    if (!thumbnail.trim()) next.thumbnail = 'Thumbnail URL is required.';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    const payload: SermonInput = {
      title: title.trim(),
      slug: slug.trim() || undefined,
      description: description.trim(),
      speaker: speaker.trim(),
      series: series.trim() || undefined,
      date,
      durationMinutes: Number(duration) || 0,
      thumbnail: thumbnail.trim(),
      videoUrl: videoUrl.trim() || undefined,
      audioUrl: audioUrl.trim() || undefined,
      scripture: scripture.trim() || undefined,
      tags: tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      featured,
    };

    setSaving(true);
    try {
      if (editing && initial) {
        await sermonService.update(initial.slug, payload);
        notify('Sermon updated.', 'success');
      } else {
        await sermonService.create(payload);
        notify('Sermon created.', 'success');
      }
      onSuccess();
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Could not save sermon.', 'error');
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <FormField label="Title" htmlFor="s-title" error={errors.title} required>
        <Input id="s-title" value={title} onChange={(e) => setTitle(e.target.value)} required />
      </FormField>

      <FormRow>
        <FormField label="Speaker" htmlFor="s-speaker" error={errors.speaker} required>
          <Input
            id="s-speaker"
            value={speaker}
            onChange={(e) => setSpeaker(e.target.value)}
            required
          />
        </FormField>
        <FormField label="Series" htmlFor="s-series" hint="Optional">
          <Input id="s-series" value={series} onChange={(e) => setSeries(e.target.value)} />
        </FormField>
      </FormRow>

      <FormRow>
        <FormField label="Date" htmlFor="s-date" error={errors.date} required>
          <Input id="s-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </FormField>
        <FormField label="Duration (minutes)" htmlFor="s-duration">
          <Input
            id="s-duration"
            type="number"
            min={0}
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          />
        </FormField>
      </FormRow>

      <FormField
        label="Slug"
        htmlFor="s-slug"
        hint="Leave blank to generate from the title."
      >
        <Input id="s-slug" value={slug} onChange={(e) => setSlug(e.target.value)} />
      </FormField>

      <FormField label="Thumbnail URL" htmlFor="s-thumb" error={errors.thumbnail} required>
        <Input id="s-thumb" value={thumbnail} onChange={(e) => setThumbnail(e.target.value)} />
      </FormField>

      <FormRow>
        <FormField label="Video URL" htmlFor="s-video" hint="Optional">
          <Input id="s-video" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} />
        </FormField>
        <FormField label="Audio URL" htmlFor="s-audio" hint="Optional">
          <Input id="s-audio" value={audioUrl} onChange={(e) => setAudioUrl(e.target.value)} />
        </FormField>
      </FormRow>

      <FormRow>
        <FormField label="Scripture" htmlFor="s-scripture" hint="e.g. John 3:16">
          <Input
            id="s-scripture"
            value={scripture}
            onChange={(e) => setScripture(e.target.value)}
          />
        </FormField>
        <FormField label="Tags" htmlFor="s-tags" hint="Comma-separated">
          <Input id="s-tags" value={tags} onChange={(e) => setTags(e.target.value)} />
        </FormField>
      </FormRow>

      <FormField label="Description" htmlFor="s-desc" error={errors.description} required>
        <TextArea
          id="s-desc"
          rows={5}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </FormField>

      <Checkbox
        id="s-featured"
        label="Feature this sermon"
        checked={featured}
        onChange={(e) => setFeatured(e.target.checked)}
      />

      <FormActions>
        <Button type="button" variant="ghost" onClick={onCancel} disabled={saving}>
          Cancel
        </Button>
        <Button type="submit" disabled={saving}>
          {saving ? 'Saving…' : editing ? 'Save changes' : 'Create sermon'}
        </Button>
      </FormActions>
    </form>
  );
}
