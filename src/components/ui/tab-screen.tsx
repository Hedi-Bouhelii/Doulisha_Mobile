import type { ReactNode } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Text } from './text';

/** A tab's page: the same large title as Discover and Account, under the status bar. */
export function TabScreen({ title, children }: { title: string; children: ReactNode }) {
  const insets = useSafeAreaInsets();
  return (
    <View className="flex-1 bg-background px-5" style={{ paddingTop: insets.top + 16 }}>
      <Text font="display" weight="bold" size="4xl" accessibilityRole="header">
        {title}
      </Text>
      <View className="flex-1 justify-center pb-8">{children}</View>
    </View>
  );
}
