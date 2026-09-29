# 0002. Code shared with the web, copied by `pnpm sync:web`

- Status: Accepted (founder "go", 2026-09-29)
- Date: 2026-09-29

## Context

The app lives in its own repository (web ADR 0006) and cannot import the web's workspace packages. It needs the API types, the interface messages, the formatters (TND, Tunis time), the design tokens and the Zod validators, without forking any of them. Git dependencies would need every web change pushed first, and the web packages publish TypeScript source for Next.js to compile.

## Decision

- **`pnpm sync:web`** (`scripts/sync-web.mjs`) copies from the web repository (`../dolisha`, or `DOULISHA_WEB_DIR`) into `src/shared/web/`:
  - `packages/api-types/dist/index.d.ts` → `api-types.d.ts` (web ADR 0024);
  - `packages/i18n` messages, `index.ts`, `format.ts`, `locales.ts`;
  - `packages/ui-tokens` `tokens.ts`, `contrast.ts`;
  - `packages/validators` `index.ts`, `common.ts`, `events.ts`.
- It records the web commit in `src/shared/web/SOURCE.json`, refuses uncommitted web changes (unless `--allow-dirty`), and checks that every library the API types import is installed here, so no type silently becomes `any`. `drizzle-orm` and `@neondatabase/serverless` are installed as dev dependencies for that reason only; nothing from them reaches the app bundle.
- **Nothing in `src/shared/web/` is edited by hand**; it is excluded from ESLint and Prettier. Change the web repository, commit, then sync.
- **App-only messages** (tab names, the restart prompt) live in `src/i18n/messages/{ar,fr,en}.json` as the `App` namespace; a test checks the three files have the same keys. Everything the web already says is reused from its messages.
- **Messages keep their ICU format**: i18next with `i18next-icu`. A test parses every web message with `intl-messageformat`, the library the app uses, in all three languages.

## Consequences

- The copied files are committed, so CI and other machines do not need the web repository.
- After an API change: build and commit `api-types` in the web repository, then `pnpm sync:web` here; the typecheck shows what broke.
