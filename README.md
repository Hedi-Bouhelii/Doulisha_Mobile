# Doulisha mobile

The Doulisha app for Android (iOS later): discover events in Tunisia, book, keep tickets offline, and for organizers, manage attendees and check people in. Arabic, French and English.

It uses the same API and accounts as the web app ([Hedi-Bouhelii/Doulisha](https://github.com/Hedi-Bouhelii/Doulisha), live at <https://doulisha.vercel.app>).

## Stack

Expo SDK 57 (React Native 0.86) with Expo Router, NativeWind, TanStack Query with the tRPC client, Better Auth's Expo client, i18next with ICU messages. Details and reasons in [docs/decisions](docs/decisions/README.md).

## Set up

Needs Node 24, pnpm 12, Android Studio's SDK (`%LOCALAPPDATA%\Android\Sdk`) with JDK 17, and an emulator with hardware acceleration or an Android phone ([docs/FOUNDER_TASKS.md](docs/FOUNDER_TASKS.md)).

```sh
pnpm install
cp .env.example .env.local      # optional: only to point at another API
pnpm android                    # builds the development app, installs it, starts Metro
```

The development build talks to the web app running on your computer (`pnpm dev` in the web repository, port 3000). Sign-in codes appear in the web's dev outbox; the app links to it from every code screen.

Seeded accounts on the `dev` database: participant Yasmine `+216 50 000 001`, organizer Sami `+216 22 000 001` (password `doulisha-e2e-2026` once an E2E run has set it; otherwise sign in with a code).

## Commands

```sh
pnpm android        # development build on the emulator or a plugged-in phone
pnpm start          # Metro only (the development build is already installed)
pnpm check          # format check, lint, typecheck, tests
pnpm sync:web       # copy the API types, messages, formatters, tokens and validators from ../dolisha
```

## Layout

```text
src/
  app/            screens (Expo Router): (tabs)/, sign-in, sign-up, account-setup, language…
  components/     ui/ (Text, Button, TextField, EmptyState, Skeleton…), doulisha/ (EventCard, PriceTag, PlacesLeft…)
  features/       code per feature (auth…)
  i18n/           i18next setup, app-only messages, right-to-left switch, error messages
  lib/            API client, auth client, config, storage
  theme/          colours from the tokens, fonts, theme provider
  shared/web/     copied from the web repository by `pnpm sync:web`: do not edit
docs/             decisions, open questions, founder tasks, handoff
```

## Documents

- [MOBILE_HANDOFF.md](MOBILE_HANDOFF.md): what the web project decided and what the app must reuse.
- The specification, build prompt, API reference and UX guidelines are in the web repository's `docs/`.
- [docs/OPEN_QUESTIONS.md](docs/OPEN_QUESTIONS.md), [docs/FOUNDER_TASKS.md](docs/FOUNDER_TASKS.md), [CHANGELOG.md](CHANGELOG.md).
