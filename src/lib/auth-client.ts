import { expoClient } from '@better-auth/expo/client';
import { anonymousClient, emailOTPClient, phoneNumberClient } from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';
import * as SecureStore from 'expo-secure-store';

import { API_URL } from './config';

/**
 * Better Auth for the app (ADR 0004): the same /api/auth endpoints as the
 * web, with the session cookie kept in SecureStore and sent by hand on every
 * API call (lib/trpc.ts). Google and Facebook open in the browser and come
 * back through doulisha://.
 */
export const authClient = createAuthClient({
  baseURL: API_URL,
  plugins: [
    expoClient({
      scheme: 'doulisha',
      storagePrefix: 'doulisha',
      cookiePrefix: 'doulisha',
      storage: SecureStore,
    }),
    phoneNumberClient(),
    emailOTPClient(),
    anonymousClient(),
  ],
});

/**
 * Google and Facebook sign-in needs the API on a public https address: the
 * provider sends the browser back to the API, which an emulator pointed at
 * the computer (10.0.2.2) cannot receive.
 */
export const socialSignInAvailable = API_URL.startsWith('https://');
