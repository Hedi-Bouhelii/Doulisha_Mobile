# Architecture decisions (mobile app)

Numbered records of the technical choices made for the mobile app. Decisions shared with the web live in the web repository's `docs/decisions/` and are referred to as "web ADR NNNN".

| ADR  | Title                                                                                                      | Status   |
| ---- | ---------------------------------------------------------------------------------------------------------- | -------- |
| 0001 | [Expo (React Native) with Expo Router, Android first](0001-expo-stack.md)                                  | Accepted |
| 0002 | [Code shared with the web, copied by `pnpm sync:web`](0002-shared-code-from-the-web.md)                    | Accepted |
| 0003 | [NativeWind with the web's tokens, fonts per language, right-to-left by restart](0003-styling-and-theme.md) | Accepted |
| 0004 | [Better Auth's Expo client and the tRPC client](0004-auth-and-api-client.md)                               | Accepted |

## Template

```md
# NNNN. Title

- Status: Proposed | Accepted | Superseded by NNNN
- Date: YYYY-MM-DD

## Context

## Decision

## Consequences
```
