import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { settingsService } from '@/services';
import type { SettingsInput } from '@/services/settingsService';
import { useSettings } from '@/context/SettingsContext';
import { useToast } from '@/context/ToastContext';
import { SEO, Button } from '@/components/common';
import { AdminPageHeader, FormField, FormActions, Input } from '../../components';
import styles from './Branding.module.css';

/* ============================================================
   Admin Branding — edit the site-wide logo, background photos,
   social-share image and accent color without touching code.
   Values are stored in the SiteSettings singleton; any field left
   blank falls back to the built-in siteConfig default. Paste an
   image URL (e.g. a Cloudinary / hosted link) into each box.
   ============================================================ */

interface FormState {
  logoUrl: string;
  heroImageUrl: string;
  pageHeaderImageUrl: string;
  ogImageUrl: string;
  accentColor: string;
}

const BLANK: FormState = {
  logoUrl: '',
  heroImageUrl: '',
  pageHeaderImageUrl: '',
  ogImageUrl: '',
  accentColor: '',
};

const HEX_RE = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

export default function AdminBrandingPage() {
  const { settings, loaded, reload } = useSettings();
  const { notify } = useToast();

  const [form, setForm] = useState<FormState>(BLANK);
  const [saving, setSaving] = useState(false);
  const [accentError, setAccentError] = useState<string | undefined>();

  // Seed the form from the loaded settings (once available).
  useEffect(() => {
    if (!loaded) return;
    setForm({
      logoUrl: settings.logoUrl ?? '',
      heroImageUrl: settings.heroImageUrl ?? '',
      pageHeaderImageUrl: settings.pageHeaderImageUrl ?? '',
      ogImageUrl: settings.ogImageUrl ?? '',
      accentColor: settings.accentColor ?? '',
    });
  }, [loaded, settings]);

  function set<K extends keyof FormState>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const accent = form.accentColor.trim();
    if (accent && !HEX_RE.test(accent)) {
      setAccentError('Enter a hex color like #35e0ff (or leave blank).');
      return;
    }
    setAccentError(undefined);

    // Empty strings intentionally clear a field back to the default.
    const payload: SettingsInput = {
      logoUrl: form.logoUrl.trim(),
      heroImageUrl: form.heroImageUrl.trim(),
      pageHeaderImageUrl: form.pageHeaderImageUrl.trim(),
      ogImageUrl: form.ogImageUrl.trim(),
      accentColor: accent,
    };

    setSaving(true);
    try {
      await settingsService.update(payload);
      notify('Branding saved.', 'success');
      reload();
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Could not save branding.', 'error');
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <SEO title="Branding · Admin" path="/admin/settings" noindex />
      <AdminPageHeader
        title="Branding"
        description="Set the logo, background photos, social-share image and accent color. Leave a box blank to use the built-in default."
      />

      <form className={styles.form} onSubmit={handleSubmit}>
        <FormField
          label="Logo image URL"
          htmlFor="logoUrl"
          hint="Shown in the navbar and footer. Blank uses the built-in wordmark."
        >
          <Input
            id="logoUrl"
            type="url"
            inputMode="url"
            placeholder="https://…/logo.png"
            value={form.logoUrl}
            onChange={(e) => set('logoUrl', e.target.value)}
          />
          {form.logoUrl.trim() && (
            <img className={styles.previewLogo} src={form.logoUrl.trim()} alt="Logo preview" />
          )}
        </FormField>

        <FormField
          label="Homepage hero background URL"
          htmlFor="heroImageUrl"
          hint="Large photo behind the homepage hero. Blank uses the gradient background."
        >
          <Input
            id="heroImageUrl"
            type="url"
            inputMode="url"
            placeholder="https://…/hero.jpg"
            value={form.heroImageUrl}
            onChange={(e) => set('heroImageUrl', e.target.value)}
          />
          {form.heroImageUrl.trim() && (
            <img className={styles.previewWide} src={form.heroImageUrl.trim()} alt="Hero preview" />
          )}
        </FormField>

        <FormField
          label="Interior page header background URL"
          htmlFor="pageHeaderImageUrl"
          hint="Photo behind the header on interior pages (About, Ministries, etc.)."
        >
          <Input
            id="pageHeaderImageUrl"
            type="url"
            inputMode="url"
            placeholder="https://…/page-header.jpg"
            value={form.pageHeaderImageUrl}
            onChange={(e) => set('pageHeaderImageUrl', e.target.value)}
          />
          {form.pageHeaderImageUrl.trim() && (
            <img
              className={styles.previewWide}
              src={form.pageHeaderImageUrl.trim()}
              alt="Page header preview"
            />
          )}
        </FormField>

        <FormField
          label="Social share image URL (Open Graph)"
          htmlFor="ogImageUrl"
          hint="Preview image when a link is shared on Facebook, Messenger, etc. Use a full https:// URL."
        >
          <Input
            id="ogImageUrl"
            type="url"
            inputMode="url"
            placeholder="https://…/og-image.jpg"
            value={form.ogImageUrl}
            onChange={(e) => set('ogImageUrl', e.target.value)}
          />
          {form.ogImageUrl.trim() && (
            <img className={styles.previewWide} src={form.ogImageUrl.trim()} alt="OG image preview" />
          )}
        </FormField>

        <FormField
          label="Brand accent color"
          htmlFor="accentColor"
          hint="Hex color used for highlights and buttons. Blank uses the default."
          error={accentError}
        >
          <div className={styles.colorRow}>
            <input
              type="color"
              aria-label="Pick accent color"
              className={styles.swatch}
              value={HEX_RE.test(form.accentColor.trim()) ? form.accentColor.trim() : '#35e0ff'}
              onChange={(e) => set('accentColor', e.target.value)}
            />
            <Input
              id="accentColor"
              type="text"
              placeholder="#35e0ff"
              value={form.accentColor}
              onChange={(e) => set('accentColor', e.target.value)}
              className={styles.colorText}
            />
          </div>
        </FormField>

        <FormActions>
          <Button type="submit" disabled={saving}>
            {saving ? 'Saving…' : 'Save branding'}
          </Button>
        </FormActions>
      </form>
    </>
  );
}
