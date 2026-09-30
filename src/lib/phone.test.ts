import { describe, expect, it } from 'vitest';

import { formatPhone } from './phone';

describe('formatPhone', () => {
  it('groups Tunisian numbers', () => {
    expect(formatPhone('+21650000001')).toBe('+216 50 000 001');
  });

  it('leaves other numbers as stored', () => {
    expect(formatPhone('+33612345678')).toBe('+33612345678');
  });
});
