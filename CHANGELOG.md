# Changelog

All notable changes to this project are recorded here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Changed: part 3a, UI pass after phone testing (2026-09-30)

- New look across the app ([docs/UI.md](docs/UI.md)): Discover with the brand bar, a greeting and richer event cards (calendar badge, shaded photo, price pill); full-screen sign-in and sign-up pages; Account with a profile card, grouped settings and a "finish sign-up" card; a language picker with samples in each language; empty states with illustrations; a tab bar with an active pill.
- Components: buttons with press feedback and haptics, fields with focus rings and icons, a six-box code field that verifies by itself, bottom sheets instead of system dialogs.
- Fixed: plurals showed raw `{count, plural, …}` text (Hermes has no `Intl.PluralRules`); "1 participants" and Arabic counts (web branch `fix/count-plurals`); badge text invisible when two colour classes met; phone numbers reversed in Arabic fields; fields hidden by the keyboard; tab labels under Android's navigation bar; sign-up skipping the setup step; the Organiser tab missing right after setup; "back" after a language restart leaving the app.
- Phone numbers show grouped (`+216 50 000 001`); `pnpm sync:web --ref <branch>` copies from a web branch without checking it out.

### Added: part 3a, foundation (2026-09-29)

- Expo SDK 57 app with Expo Router, development, preview and production variants (`tn.doulisha.app`), the Doulisha icon and splash screen (ADR 0001).
- `pnpm sync:web` copies the API types, messages, formatters, tokens and validators from the web repository (ADR 0002).
- Design system: the web's colours in light and dark, Playfair Display, Inter, Amiri and IBM Plex Sans Arabic embedded, base components (Text, Button, TextField, EmptyState, Skeleton, ListRow), EventCard, PriceTag, PlacesLeft (ADR 0003).
- Arabic, French and English with the web's messages; the language switch restarts the app when the direction changes.
- Sign-up (join or organize, phone or email code, then name, city and password), sign-in with a password or a code, forgot password, Google and Facebook against the live API (ADR 0004).
- Tabs: Discover (upcoming events), Tickets, Messages, Organize (organizers only) and Account; the tickets, messages and organizer screens arrive in parts 3b and 3c.
- CI: format, lint, typecheck and tests on GitHub Actions.
