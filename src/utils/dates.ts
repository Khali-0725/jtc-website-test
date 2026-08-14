/* Date/time formatting helpers (Intl-based, en-PH friendly). */

export function formatDate(iso: string, opts?: Intl.DateTimeFormatOptions): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return new Intl.DateTimeFormat('en-PH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...opts,
  }).format(d);
}

export function formatShortDate(iso: string): string {
  return formatDate(iso, { month: 'short', day: 'numeric', year: 'numeric' });
}

export function formatMonthDay(iso: string): { month: string; day: string } {
  const d = new Date(iso);
  return {
    month: new Intl.DateTimeFormat('en-PH', { month: 'short' }).format(d).toUpperCase(),
    day: new Intl.DateTimeFormat('en-PH', { day: '2-digit' }).format(d),
  };
}

export function isUpcoming(iso: string): boolean {
  return new Date(iso).getTime() >= Date.now() - 1000 * 60 * 60 * 12;
}

export function formatDuration(minutes: number): string {
  if (!minutes || minutes < 1) return '';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m} min`;
  if (m === 0) return `${h} hr`;
  return `${h} hr ${m} min`;
}
