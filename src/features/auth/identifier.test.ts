import { describe, expect, it } from 'vitest';

import { parseIdentifier } from './identifier';

describe('parseIdentifier', () => {
  it('reads Tunisian numbers as +216 (E.164)', () => {
    expect(parseIdentifier('phone', '20 123 456')).toBe('+21620123456');
    expect(parseIdentifier('phone', '0021650000001')).toBe('+21650000001');
    expect(parseIdentifier('phone', '+33 6 12 34 56 78')).toBe('+33612345678');
  });

  it('refuses what is not a phone number', () => {
    expect(parseIdentifier('phone', 'abc')).toBeNull();
  });

  it('normalizes email addresses', () => {
    expect(parseIdentifier('email', '  Hedi@Example.TN ')).toBe('hedi@example.tn');
    expect(parseIdentifier('email', 'not-an-email')).toBeNull();
  });
});
