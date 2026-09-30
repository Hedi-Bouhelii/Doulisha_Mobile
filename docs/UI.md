# Mobile UI

How the app looks and behaves, on top of the web's design system (web `docs/UX_GUIDELINES.md`: palette, fonts, required states, RTL rules). Check every new screen on a phone in Arabic and French, light and dark.

## Look

- **Warm and photo-led**, like the web template: cream background, white cards with soft warm shadows (none in dark mode, where borders separate surfaces), forest green for actions, terracotta for urgency and highlights.
- **Large titles** on every tab page (`TabScreen`, Playfair Display or Amiri, 36 px) and on the auth screens; the navigation bar above auth screens only holds "back".
- **Rounded shapes:** cards 24 px, fields 14 px, buttons fully round.
- **Category accents** on cards and chips (`useAccent`): pale tiles in light mode, the solid colour softened with cream text in dark mode.

## Components (`src/components`)

| Component                                             | Use                                                                                                                                                                                       |
| ----------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Text`                                                | All text. Font per interface language and role (`body`, `display`), weight by family (never `fontWeight`), line height that grows with the phone's font size (up to 1.5×).                |
| `Button`, `IconButton`                                | Variants `primary`, `secondary`, `outline`, `ghost`, `link`, `destructive`; sizes `sm`, `md` (52 px), `lg` (56 px). Labels wrap inside the button. Main actions tap lightly (haptics).    |
| `PressableScale`                                      | Anything tappable that should shrink a little under the finger (150 ms; still when "reduce motion" is on).                                                                                |
| `TextField`, `CodeField`                              | Label, icon, hint, focus ring, red border on the field to fix. `ltr` for phone numbers, emails and passwords. The code field shows six boxes over one hidden input (paste, SMS autofill). |
| `ConfirmSheet` (`useConfirm`)                         | Bottom sheet before important actions (sign out, restart for Arabic) instead of Android's grey dialog.                                                                                    |
| `EmptyState`                                          | Empty and error states: ringed icon, title, hint, one or two actions.                                                                                                                     |
| `Skeleton`                                            | Loading placeholders with the final shape; pulses unless "reduce motion" is on.                                                                                                           |
| `ListRow`, `ListSection`                              | Settings rows with a tinted icon tile, grouped on one card.                                                                                                                               |
| `EventCard`, `PriceTag`, `PlacesLeft`, `CategoryIcon` | Same names and rules as the web. The card adds a calendar badge, a shaded photo with the category, and the price in a pill.                                                               |

## Rules learned on a real phone (Galaxy A07, Android 16)

- **Plurals need a polyfill.** Hermes has no `Intl.PluralRules`; without `src/i18n/intl-polyfills.ts` every ICU plural shows as raw `{count, plural, …}` text.
- **Text colour classes don't combine.** Tailwind applies whichever colour class comes later in its stylesheet, not in `className`. `Text` only adds its default colour when no other `text-…` colour is given (`hasTextColour`); do the same in new components.
- **Left-to-right fields in Arabic** need the whole field laid out left to right (`direction: 'ltr'`), `writingDirection: 'ltr'` on the input, and the placeholder wrapped in `⁦…⁩`; otherwise "20 123 456" shows as "456 123 20".
- **The keyboard** covers fields in Android's edge-to-edge mode: forms scroll with `KeyboardAwareScrollView` (`react-native-keyboard-controller`).
- **Edge to edge:** the window behind the app is painted in the theme's background (`expo-system-ui`), and pages pad their bottom with the safe-area inset so nothing sits under the navigation bar.
- **Metro and edits:** after a native change, rebuild (`./gradlew installDebug`); if the phone shows old code, force-stop the app and reopen it.
