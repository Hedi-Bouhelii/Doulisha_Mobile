# Changelog

All notable changes to this project are recorded here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Added: part 3a, foundation (2026-09-29)

- Expo SDK 57 app with Expo Router, development, preview and production variants (`tn.doulisha.app`), the Doulisha icon and splash screen (ADR 0001).
- `pnpm sync:web` copies the API types, messages, formatters, tokens and validators from the web repository (ADR 0002).
- Design system: the web's colours in light and dark, Playfair Display, Inter, Amiri and IBM Plex Sans Arabic embedded, base components (Text, Button, TextField, EmptyState, Skeleton, ListRow), EventCard, PriceTag, PlacesLeft (ADR 0003).
- Arabic, French and English with the web's messages; the language switch restarts the app when the direction changes.
- Sign-up (join or organize, phone or email code, then name, city and password), sign-in with a password or a code, forgot password, Google and Facebook against the live API (ADR 0004).
- Tabs: Discover (upcoming events), Tickets, Messages, Organize (organizers only) and Account; the tickets, messages and organizer screens arrive in parts 3b and 3c.
- CI: format, lint, typecheck and tests on GitHub Actions.
