import { TRPCClientError } from '@trpc/client';
import { describe, expect, it } from 'vitest';

import { authErrorKey, errorMessageKey } from './error-keys';

const known = new Set(['Errors.soldOut', 'Errors.generic']);
const exists = (key: string) => known.has(key);

describe('errorMessageKey', () => {
  it('uses the API key when a translation exists', () => {
    expect(errorMessageKey(new TRPCClientError('errors.soldOut'), exists)).toBe('Errors.soldOut');
  });

  it('falls back to the generic message for unknown keys and plain errors', () => {
    expect(errorMessageKey(new TRPCClientError('errors.somethingNew'), exists)).toBe(
      'Errors.generic',
    );
    expect(errorMessageKey(new Error('boom'), exists)).toBe('Errors.generic');
  });

  it('reports a request that never reached the server as a connection problem', () => {
    const offline = new TypeError('Network request failed');
    expect(errorMessageKey(offline, exists)).toBe('App.offlineError');
    expect(
      errorMessageKey(new TRPCClientError('Network request failed', { cause: offline }), exists),
    ).toBe('App.offlineError');
  });
});

describe('authErrorKey', () => {
  it('maps Better Auth codes like the web', () => {
    expect(authErrorKey({ status: 429 })).toBe('tooManyRequests');
    expect(authErrorKey({ status: 401, code: 'INVALID_EMAIL_OR_PASSWORD' })).toBe(
      'invalidCredentials',
    );
    expect(authErrorKey({ status: 400, code: 'INVALID_OTP' })).toBe('invalidCode');
    expect(authErrorKey({ status: 400, code: 'CREDENTIAL_ACCOUNT_NOT_FOUND' })).toBe(
      'noPasswordYet',
    );
    expect(authErrorKey(null)).toBe('generic');
  });
});
