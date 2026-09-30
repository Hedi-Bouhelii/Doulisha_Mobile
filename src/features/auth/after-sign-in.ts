import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { useCallback } from 'react';

import { useTRPC } from '@/lib/trpc';

/**
 * Where to go once signed in: the setup step when the account still needs a
 * name or a password (ADR 0016 of the web), otherwise back where the person was.
 */
export function useAfterSignIn() {
  const router = useRouter();
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useCallback(
    async ({ checkSetup, welcome = false, accountType }: AfterSignIn) => {
      let needsSetup = welcome;
      if (checkSetup && !welcome) {
        const status = await queryClient
          .fetchQuery({ ...trpc.account.status.queryOptions(), staleTime: 0 })
          .catch(() => null);
        needsSetup = status?.needsSetup ?? false;
      }
      if (needsSetup) {
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
    [queryClient, router, trpc],
  );
}

interface AfterSignIn {
  /** Ask the API whether setup is still needed (after a code). */
  checkSetup: boolean;
  /** A new Google or Facebook account from the sign-up screen: setup asks the city and the account type. */
  welcome?: boolean;
  accountType?: 'participant' | 'organizer';
}
