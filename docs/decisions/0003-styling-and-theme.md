# 0003. NativeWind with the web's tokens, fonts per language, right-to-left by restart

- Status: Accepted
- Date: 2026-09-29

## Context

The build prompt asks for NativeWind with the same tokens as the web (web ADR 0009: forest green, terracotta, cream; Playfair Display and Inter, Amiri and IBM Plex Sans Arabic; every text colour WCAG AA in light and dark). React Native applies a right-to-left layout only after a restart, and on Android each font weight is its own family.

## Decision

- **NativeWind 4.2** (the stable line, Tailwind CSS 3.4). NativeWind 5 and Tailwind 4 were still release candidates.
- **Colours are CSS variables.** `tailwind.config.ts` defines `bg-primary`, `text-muted-foreground`… as `rgb(var(--color-…))`, built from the synced `tokens.ts`; `<ThemeProvider>` sets the light or dark values with NativeWind's `vars()`, following the phone's setting. `useColors()` gives plain values for icons and navigation bars. Category accents are fixed colours (`cat-outdoor`, `cat-outdoor-bg`…).
- **Fonts are embedded at build time** by the `expo-font` plugin (12 files, about 3.4 MB before compression). `<Text>` picks the family from the interface language, the role (`body` or `display`) and the weight, never `fontWeight`; Arabic body text gets a line height of 1.7.
- **Right-to-left:** the layout follows the language. Switching between Arabic and French or English asks first, sets `I18nManager.forceRTL`, then restarts the app (`expo-updates`' `reloadAsync`). At startup the app corrects a mismatch (an Arabic phone set to French) with at most one restart in a row.
- Logical classes only (`ms-`, `pe-`, `start-`, `end-`), as on the web. Directional icons are mirrored in right-to-left.

## Consequences

- Changing a colour happens in the web's `tokens.ts` (with its contrast tests), then `pnpm sync:web`.
- Text in the other script (an Arabic name on a French screen) uses Android's own fallback font.
