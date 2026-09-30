import { TRPCClientError } from '@trpc/client';

/**
 * The message key for any failure (docs/API.md of the web, "Error format"):
 * API errors carry a key such as `errors.soldOut`, shown from `Errors.soldOut`
 * when it exists; a request that never reached the server is a connection
 * problem; anything else is `Errors.generic`.
 */
export function errorMessageKey(error: unknown, exists: (key: string) => boolean): string {
  if (error instanceof TRPCClientError) {
    const match = /^errors\.(\w+)$/.exec(error.message);
    if (match?.[1] && exists(`Errors.${match[1]}`)) return `Errors.${match[1]}`;
    if (isNetworkFailure(error.cause) || isNetworkFailure(error)) return 'App.offlineError';
  } else if (isNetworkFailure(error)) {
    return 'App.offlineError';
  }
  return 'Errors.generic';
}

function isNetworkFailure(error: unknown): boolean {
  return (
    error instanceof Error &&
    /network request failed|fetch failed|failed to fetch/i.test(error.message)
  );
}

/**
 * Better Auth failures to our `Errors` keys, as on the web (auth-parts.tsx).
 * Better Auth returns codes such as INVALID_OTP or INVALID_EMAIL_OR_PASSWORD.
 */
export function authErrorKey(error: { status?: number; code?: string } | null | undefined) {
  if (!error) return 'generic' as const;
  const code = error.code ?? '';
  if (error.status === 429) return 'tooManyRequests' as const;
  if (code.includes('CREDENTIAL_ACCOUNT_NOT_FOUND')) return 'noPasswordYet' as const;
  if (code.includes('OR_PASSWORD') || code.includes('INVALID_PASSWORD'))
    return 'invalidCredentials' as const;
  if (code.includes('PASSWORD_TOO_SHORT')) return 'passwordTooShort' as const;
  if (code.includes('OTP') || code.includes('CODE')) return 'invalidCode' as const;
  if (code.includes('PHONE')) return 'invalidPhone' as const;
  if (code.includes('EMAIL')) return 'invalidEmail' as const;
  return 'generic' as const;
}
