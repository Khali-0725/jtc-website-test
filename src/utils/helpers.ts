import { PLACEHOLDER_PREFIX, PLACEHOLDER_HUES } from '@/data/constants';

/** Is this image value a branded-placeholder sentinel? */
export function isPlaceholderImage(src?: string): boolean {
  return !!src && src.startsWith(PLACEHOLDER_PREFIX);
}

/** Stable numeric hash for deterministic placeholder styling. */
export function hashString(input: string): number {
  let h = 0;
  for (let i = 0; i < input.length; i += 1) {
    h = (h << 5) - h + input.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

export function placeholderHue(seed: string): number {
  return PLACEHOLDER_HUES[hashString(seed) % PLACEHOLDER_HUES.length];
}

/** Simulate network latency for mock services. */
export function delay<T>(value: T, ms = 320): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

export function classNames(...parts: (string | false | null | undefined)[]): string {
  return parts.filter(Boolean).join(' ');
}
