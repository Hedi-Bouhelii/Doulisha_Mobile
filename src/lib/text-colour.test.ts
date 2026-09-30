import { describe, expect, it } from 'vitest';

import { hasTextColour } from '@/lib/text-colour';

describe('hasTextColour', () => {
  it('sees colour classes', () => {
    expect(hasTextColour('text-background')).toBe(true);
    expect(hasTextColour('shrink text-center text-primary-foreground')).toBe(true);
    expect(hasTextColour('text-muted-foreground')).toBe(true);
  });

  it('ignores size and alignment classes', () => {
    expect(hasTextColour('text-center text-xs')).toBe(false);
    expect(hasTextColour('text-2xl uppercase')).toBe(false);
    expect(hasTextColour(undefined)).toBe(false);
  });
});
