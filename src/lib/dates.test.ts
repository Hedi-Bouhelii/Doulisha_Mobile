import { describe, expect, it } from 'vitest';

import { dateBadge } from './dates';

describe('dateBadge', () => {
  // 23:30 UTC on 2 October is already 3 October in Tunis (UTC+1).
  const lateEvening = new Date('2026-10-02T23:30:00Z');

  it('uses Tunisia time', () => {
    expect(dateBadge(lateEvening, 'en').day).toBe('3');
  });

  it('keeps Latin digits in Arabic', () => {
    expect(dateBadge(lateEvening, 'ar').day).toBe('3');
  });

  it('gives a short month without the abbreviation dot', () => {
    expect(dateBadge(lateEvening, 'fr').month).toBe('oct');
    expect(dateBadge(lateEvening, 'en').month).toBe('Oct');
  });
});
