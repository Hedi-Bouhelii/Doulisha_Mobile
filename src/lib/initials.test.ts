import { describe, expect, it } from 'vitest';

import { initials } from './initials';

describe('initials', () => {
  it('takes the first letter of two words', () => {
    expect(initials('Yasmine Ayari')).toBe('YA');
    expect(initials('sami')).toBe('S');
  });

  it('works in Arabic', () => {
    expect(initials('سامي بن علي')).toBe('سب');
  });

  it('is empty for a phone-number name', () => {
    expect(initials('+21629731406')).toBe('');
  });
});
