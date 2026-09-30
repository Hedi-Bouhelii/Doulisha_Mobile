import { ChevronRight, type LucideIcon } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { I18nManager, Pressable, View } from 'react-native';

import { cn } from '@/lib/cn';
import { useColors } from '@/theme/theme-provider';

import { Text } from './text';

/**
 * A tappable settings row: an icon on a tinted tile, the label, an optional
 * value, and a chevron that points forward in both reading directions.
 */
export function ListRow({
  icon: Icon,
  label,
  value,
  onPress,
  destructive,
  testID,
}: {
  icon: LucideIcon;
  label: string;
  value?: string;
  onPress: () => void;
  destructive?: boolean;
  testID?: string;
}) {
  const colors = useColors();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={value ? `${label}, ${value}` : label}
      onPress={onPress}
      testID={testID}
      className="min-h-16 flex-row items-center gap-3.5 px-4 py-3 active:bg-accent"
    >
      <View
        className={cn(
          'h-10 w-10 items-center justify-center rounded-xl',
          destructive ? 'bg-highlight-soft' : 'bg-secondary',
        )}
      >
        <Icon size={20} color={destructive ? colors.destructive : colors.primary} />
      </View>
      <Text weight="medium" className={cn('flex-1', destructive && 'text-destructive')}>
        {label}
      </Text>
      {value ? (
        <Text size="sm" className="text-muted-foreground">
          {value}
        </Text>
      ) : null}
      {destructive ? null : (
        <View style={{ transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }] }}>
          <ChevronRight size={18} color={colors.mutedForeground} />
        </View>
      )}
    </Pressable>
  );
}

/** A titled group of rows on one card, separated by hairlines. */
export function ListSection({ title, children }: { title?: string; children: ReactNode }) {
  const items = (Array.isArray(children) ? children : [children]).filter(Boolean);
  return (
    <View className="gap-2">
      {title ? (
        <Text size="sm" weight="semibold" className="px-1 uppercase text-muted-foreground">
          {title}
        </Text>
      ) : null}
      <View className="overflow-hidden rounded-2xl border border-border bg-card">
        {items.map((child, index) => (
          <View key={index}>
            {index > 0 ? <View className="ms-[70px] h-px bg-border" /> : null}
            {child}
          </View>
        ))}
      </View>
    </View>
  );
}
