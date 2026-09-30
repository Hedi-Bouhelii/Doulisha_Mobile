# 0004. Better Auth's Expo client and the tRPC client

- Status: Accepted
- Date: 2026-09-29
- Web counterpart: web ADR 0023 (the `expo()` server plugin and the trusted `doulisha://` origin)

## Context

The app signs in through the web's `/api/auth` (Better Auth 1.7: phone and email codes, passwords, Google and Facebook, guest sessions) and calls the tRPC API with superjson. React Native has no cookie jar.

## Decision

- **Auth client:** `createAuthClient` with `expoClient({ scheme: 'doulisha', storagePrefix: 'doulisha', cookiePrefix: 'doulisha', storage: SecureStore })` and the phone-number, email-OTP and anonymous plugins. `better-auth` and `@better-auth/expo` stay on the web's version.
- **API client:** `httpBatchLink` to `{API_URL}/api/trpc` with superjson; every call sends `x-doulisha-locale` and the session cookie from `authClient.getCookie()`, with `credentials: 'omit'`. TanStack Query knows about the network (NetInfo) and app focus (AppState). Signing in or out refreshes every query.
- **Where the API is:** `EXPO_PUBLIC_API_URL`, else `http://10.0.2.2:3000` for development builds (the emulator's name for the computer) and `https://doulisha.vercel.app` for preview and production.
- **Screens follow the web's flows** (web ADR 0016): sign-up asks join or organize, phone or email, a 6-digit code, then name, city and password; sign-in shows the password first with "Receive a code instead"; forgot password by code.
- **Google and Facebook open in the browser** and return through `doulisha://`: no Android OAuth client is needed. They need the API on public https, so the buttons are hidden when the app talks to a local server.
- **Errors:** API errors show the `Errors` message for their key, a failed connection shows "No connection…", anything else `Errors.generic`; Better Auth codes map as on the web.

## Consequences

- Google and Facebook sign-in are tried against the live API (preview build), not in local development.
- After Google or Facebook on the sign-up screen, setup always opens (city, join or organize): the app cannot tell a new account from an existing one there (OPEN_QUESTIONS M3).
