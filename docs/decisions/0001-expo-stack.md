# 0001. Expo (React Native) with Expo Router, Android first

- Status: Accepted (founder, 2026-09-29)
- Date: 2026-09-29

## Context

The web repository's build prompt makes Expo mandatory for the mobile app (section 3) and the specification (section 9) chose React Native for "one TypeScript codebase for a small team". Before starting, the founder asked whether Flutter would perform better. The trade-off: Flutter would lose the tRPC types (it would need an OpenAPI description and a generated Dart client), has no official Better Auth client, and would need converters for the messages, formatters, tokens and validators. The founder chose Expo so the app reuses what the web already has.

## Decision

- **Expo SDK 57** (React Native 0.86, React 19.2), New Architecture and Hermes, **Expo Router** with typed routes and the React Compiler (template defaults).
- **pnpm 12 with `nodeLinker: hoisted`** (a flat `node_modules`, as web ADR 0006 noted React Native needs). With pnpm's isolated layout, the native C++ builds (react-native-screens, worklets, expo-updates) failed on Windows because their paths passed CMake's 250-character limit, and Expo was installed twice under different peer variants. `react-native-css-interop` stays a direct dependency because NativeWind's JSX transform makes the app's own code import it.
- **One NDK:** a small config plugin (`plugins/with-shared-ndk.js`) makes native modules that name no NDK version (expo-updates) use React Native's, instead of downloading the Android Gradle plugin's default (another 1 GB).
- **Development builds** (`expo-dev-client`), not Expo Go: SecureStore, SQLite and, later, the camera and push notifications need native code. Native folders are generated (`npx expo prebuild`) and not committed.
- **Build variants** from `APP_VARIANT` (`app.config.ts`): `development` (`tn.doulisha.app.dev`), `preview` (`tn.doulisha.app.preview`) and `production` (`tn.doulisha.app`, OPEN_QUESTIONS Q2 of the web). Test builds install next to the store app. All use the `doulisha://` scheme.
- **Performance habits from the start** (the founder's concern): FlashList for lists, expo-image for pictures, Reanimated for motion, fonts embedded at build time (no loading at startup), speed measured on release builds only. Part 3d measures the budgets (event list under 2 s on throttled 4G, app under 40 MB).
- **Tests:** Vitest for logic that does not need React Native; Maestro for screens (part 3d).

## Consequences

- Running the app needs an Android emulator with hardware acceleration or a phone (docs/FOUNDER_TASKS.md).
- Expo Go cannot open this app; use the development build.
