# Working rules for Claude Code (Doulisha mobile)

Read first:

- `MOBILE_HANDOFF.md`: what the web project built and decided, and what this app reuses.
- In the web repository (`../dolisha`): `docs/BUILD_PROMPT.md` (wins on **technology**; Phase 3 is this app), `docs/cahier-des-charges-v2.pdf` (wins on **features, priorities and business rules**), `docs/API.md`, `docs/UX_GUIDELINES.md`, `docs/OPEN_QUESTIONS.md`.
- `docs/decisions/` here, and `docs/OPEN_QUESTIONS.md` (M1…).

## Workflow

- Work part by part (3a foundation, 3b participant, 3c organizer, 3d integration).
  - Before coding a part, post a short plan (screens, API needs, web-repository changes, tests) and wait for "go".
  - At the end, run the checks, update the docs, summarize against the acceptance criteria, then **stop**.
- Build only what the specification marks **MVP**, plus what the founder added (chat, following). Never invent requirements; log ambiguities in `docs/OPEN_QUESTIONS.md`, pick the simplest option and continue.
- Git: Conventional Commits, small commits, one branch per feature, never commit to `main`. Update README, `docs/*.md` and CHANGELOG in the same change as the code.
- Changes the app needs in the web repository go on their own branch there, following its `CLAUDE.md`.
- Record important technical choices as ADRs in `docs/decisions/`.

## Commands

```sh
pnpm install
pnpm android      # build and run the development app
pnpm check        # format check + lint + typecheck + tests (run before finishing any step)
pnpm sync:web     # refresh src/shared/web from the web repository (commit there first)
```

## Code rules

- **Expo changes every SDK:** check the versioned docs (`https://docs.expo.dev/versions/v57.0.0/`) before using an Expo API; install native packages with `npx expo install`.
- **TypeScript strict** plus `noUncheckedIndexedAccess`; no `any`.
- **`src/shared/web/` is never edited by hand** (ADR 0002).
- **Text:** always `<Text>` from `components/ui/text` (fonts per language, Arabic line height). Messages come from the web's files through `useT('Namespace')`; app-only strings go in the `App` namespace of `src/i18n/messages/*.json`, the same keys in all three files.
- **RTL:** logical classes only (`ms-`, `pe-`, `start-`, `end-`); mirror directional icons; keep numbers, prices and phone numbers left to right (wrap them in `⁦…⁩` inside sentences). Check every screen in Arabic.
- **Every screen** has loading (skeleton), empty and error states with a next action; touch targets of at least 44 px; screen-reader labels; motion of 150–250 ms that respects reduced motion.
- **Data rules:** money is integer millimes; times are shown in Africa/Tunis (use the synced formatters); phone numbers are E.164.
- **Privacy:** private events are never listed; guest lists only for hosts and guests.
- **Secrets:** never in code, commits or chat. Development uses the web's mocks (SMS, email, payments).
