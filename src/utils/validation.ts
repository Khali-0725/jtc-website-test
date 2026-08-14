/* Lightweight client-side validators (server re-validates with zod). */

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isEmail(value: string): boolean {
  return EMAIL_RE.test(value.trim());
}

export function isRequired(value: string): boolean {
  return value.trim().length > 0;
}

export function minLength(value: string, min: number): boolean {
  return value.trim().length >= min;
}

export interface FieldError {
  field: string;
  message: string;
}

/** Validate a simple record of string fields against rules. */
export function validateFields(
  values: Record<string, string>,
  rules: Record<string, (v: string) => string | null>,
): FieldError[] {
  const errors: FieldError[] = [];
  for (const [field, rule] of Object.entries(rules)) {
    const message = rule(values[field] ?? '');
    if (message) errors.push({ field, message });
  }
  return errors;
}
