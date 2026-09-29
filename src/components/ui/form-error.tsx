import { View } from 'react-native';

import { Text } from './text';

/** A sentence that says what went wrong and what to do (UX_GUIDELINES). */
export function FormError({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <View
      accessibilityRole="alert"
      accessibilityLiveRegion="polite"
      className="rounded-md bg-highlight-soft p-3"
    >
      <Text size="sm" className="text-highlight">
        {message}
      </Text>
    </View>
  );
}
