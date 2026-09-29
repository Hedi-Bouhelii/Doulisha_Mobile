import NetInfo from '@react-native-community/netinfo';
import {
  focusManager,
  onlineManager,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { createTRPCClient, httpBatchLink } from '@trpc/client';
import { createTRPCContext } from '@trpc/tanstack-react-query';
import { useEffect, useState, type ReactNode } from 'react';
import { AppState, Platform } from 'react-native';
import superjson from 'superjson';

import { currentLocale } from '@/i18n';
import type { AppRouter } from '@/shared/web/api-types';

import { authClient } from './auth-client';
import { API_URL } from './config';

export const { TRPCProvider, useTRPC, useTRPCClient } = createTRPCContext<AppRouter>();

// TanStack Query learns about the network and app focus from React Native.
onlineManager.setEventListener((setOnline) =>
  NetInfo.addEventListener((state) => setOnline(state.isConnected !== false)),
);

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { staleTime: 30_000, retry: 1 },
      mutations: { retry: 0 },
    },
  });
}

function makeTrpcClient() {
  return createTRPCClient<AppRouter>({
    links: [
      httpBatchLink({
        url: `${API_URL}/api/trpc`,
        transformer: superjson,
        // docs/API.md: the locale on every call, and the session as a cookie
        // (React Native keeps no cookie jar; Better Auth stores it, ADR 0004).
        async headers() {
          const cookie = await authClient.getCookie();
          return {
            'x-doulisha-locale': currentLocale(),
            ...(cookie ? { cookie } : {}),
          };
        },
        fetch: (url, options) => fetch(url, { ...options, credentials: 'omit' }),
      }),
    ],
  });
}

/** TanStack Query and the tRPC client for the whole app. */
export function ApiProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(makeQueryClient);
  const [trpcClient] = useState(makeTrpcClient);

  useEffect(() => {
    if (Platform.OS === 'web') return;
    const subscription = AppState.addEventListener('change', (status) =>
      focusManager.setFocused(status === 'active'),
    );
    return () => subscription.remove();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
        {children}
      </TRPCProvider>
    </QueryClientProvider>
  );
}
