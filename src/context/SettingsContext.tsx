import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { SiteSettings } from '@/types';
import { settingsService } from '@/services/settingsService';

/* ============================================================
   SettingsContext — runtime, admin-editable branding.
   Fetches the SiteSettings singleton once on mount and shares it
   with the whole app (logo, hero/page backgrounds, OG image,
   accent color). Any field left empty falls back to the built-in
   siteConfig default inside the consuming component.

   The accent color, when set, is applied to the document root as
   the `--accent` / `--accent-blue` CSS custom properties so the
   entire theme updates live. Clearing it restores the stylesheet
   default. `reload()` lets the admin Branding page apply changes
   without a full page refresh.
   ============================================================ */

interface SettingsContextValue {
  settings: SiteSettings;
  loaded: boolean;
  reload: () => void;
}

const EMPTY: SiteSettings = {};

const SettingsContext = createContext<SettingsContextValue>({
  settings: EMPTY,
  loaded: false,
  reload: () => {},
});

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(EMPTY);
  const [loaded, setLoaded] = useState(false);
  const [nonce, setNonce] = useState(0);

  const reload = useCallback(() => setNonce((n) => n + 1), []);

  useEffect(() => {
    let active = true;
    settingsService
      .get()
      .then((s) => {
        if (!active) return;
        setSettings(s ?? EMPTY);
      })
      .catch(() => {
        // Branding is non-critical: on failure the site keeps its
        // built-in siteConfig defaults rather than blocking render.
        if (active) setSettings(EMPTY);
      })
      .finally(() => {
        if (active) setLoaded(true);
      });
    return () => {
      active = false;
    };
  }, [nonce]);

  // Apply / clear the accent color on the document root.
  useEffect(() => {
    const root = document.documentElement;
    const color = settings.accentColor;
    if (color) {
      root.style.setProperty('--accent', color);
      root.style.setProperty('--accent-blue', color);
    } else {
      root.style.removeProperty('--accent');
      root.style.removeProperty('--accent-blue');
    }
    return () => {
      root.style.removeProperty('--accent');
      root.style.removeProperty('--accent-blue');
    };
  }, [settings.accentColor]);

  const value = useMemo(() => ({ settings, loaded, reload }), [settings, loaded, reload]);

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useSettings(): SettingsContextValue {
  return useContext(SettingsContext);
}
