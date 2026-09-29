import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';

import { authClient } from '@/lib/auth-client';
import { useTRPC } from '@/lib/trpc';

/** The Better Auth session on this phone (member or guest), or null. */
export function useSession() {
  return authClient.useSession();
}

/** The signed-in person with their roles (`me.get`), refetched when the session changes. */
export function useMe() {
  const trpc = useTRPC();
  const { data: session } = useSession();
  return useQuery({
    ...trpc.me.get.queryOptions(),
    enabled: !!session,
    placeholderData: undefined,
  });
}

/** Whether the person may use the organizer space (ACC-05: admins pass every role check). */
export function isOrganizer(roles: readonly string[] | undefined): boolean {
  return !!roles && (roles.includes('organizer') || roles.includes('admin'));
}

/**
 * Refreshes every API answer when someone signs in or out, so no screen shows
 * the previous person's data.
 */
export function SessionSync() {
  const queryClient = useQueryClient();
  const { data } = useSession();
  const sessionId = data?.session.id ?? null;
  const previous = useRef(sessionId);
  useEffect(() => {
    if (previous.current === sessionId) return;
    previous.current = sessionId;
    void queryClient.cancelQueries().then(() => queryClient.invalidateQueries());
  }, [sessionId, queryClient]);
  return null;
}
