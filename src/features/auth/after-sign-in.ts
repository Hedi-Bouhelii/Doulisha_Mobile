import { useRouter } from 'expo-router';
import { useCallback } from 'react';

import { useTRPCClient } from '@/lib/trpc';

/**
 * Where to go once signed in: the setup step when the account still needs a
 * name or a password (ADR 0016 of the web), otherwise back where the person was.
 */
export function useAfterSignIn() {
  const router = useRouter();
  const client = useTRPCClient();

  /**
   * Asked through the client, not the query cache: signing in refreshes every
   * query (SessionSync), which would cancel a cached request made right now.
   * One retry covers a slow first request after sign-in.
   */
  const needsSetup = useCallback(async (): Promise<boolean> => {
    for (let attempt = 0; attempt < 2; attempt += 1) {
      try {
        return (await client.account.status.query()).needsSetup;
      } catch {
        // Try once more, then assume setup is needed rather than skip it.
      }
    }
    return true;
  }, [client]);

  return useCallback(
    async ({ checkSetup, welcome = false, accountType }: AfterSignIn) => {
      const setup = welcome || (checkSetup && (await needsSetup()));
      if (setup) {
        router.replace({
          pathname: '/account-setup',
          params: {
            ...(welcome ? { welcome: '1' } : {}),
            ...(accountType ? { type: accountType } : {}),
          },
        });
      } else if (router.canGoBack()) {
        router.dismissAll();
      } else {
        router.replace('/');
      }
    },
    [needsSetup, router],
  );
}

interface AfterSignIn {
  /** Ask the API whether setup is still needed (after a code). */
  checkSetup: boolean;
  /** A new Google or Facebook account from the sign-up screen: setup asks the city and the account type. */
  welcome?: boolean;
  accountType?: 'participant' | 'organizer';
}
