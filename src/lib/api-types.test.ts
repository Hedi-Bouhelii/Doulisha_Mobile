import { describe, expectTypeOf, it } from 'vitest';

import type { RouterInputs, RouterOutputs } from '@/shared/web/api-types';

/**
 * The API types come from a bundled declaration file (ADR 0002). If a library
 * it imports were missing, types would silently become `any`: these checks
 * fail the typecheck when that happens.
 */
describe('API types', () => {
  it('types procedure inputs and outputs', () => {
    expectTypeOf<RouterOutputs['events']['upcoming']>().not.toBeAny();
    expectTypeOf<RouterOutputs['booking']['byReference']>().not.toBeAny();
    expectTypeOf<RouterOutputs['me']['get']>().not.toBeAny();
    expectTypeOf<RouterInputs['events']['upcoming']>().not.toBeAny();
    expectTypeOf<RouterInputs['organizer']['checkIn']>().toHaveProperty('code');
  });
});
