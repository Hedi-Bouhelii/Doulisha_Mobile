import { z } from 'zod';

import { phoneInputSchema } from '@/shared/web/validators';

export type Method = 'phone' | 'email';
export type AccountType = 'participant' | 'organizer';

/** Normalizes the identifier: E.164 phone or trimmed email; null when invalid (as on the web). */
export function parseIdentifier(method: Method, value: string): string | null {
  if (method === 'phone') {
    const parsed = phoneInputSchema.safeParse(value);
    return parsed.success ? parsed.data : null;
  }
  const parsed = z.email().safeParse(value.trim().toLowerCase());
  return parsed.success ? parsed.data : null;
}
