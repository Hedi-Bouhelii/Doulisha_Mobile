import { ChevronRight, type LucideIcon } from 'lucide-react-native';
import { I18nManager, Pressable, View } from 'react-native';

import { useColors } from '@/theme/theme-provider';

import { Text } from './text';

/** A tappable settings row: icon, label, optional value, and a chevron that points forward in both directions. */
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
      className="min-h-14 flex-row items-center gap-3 px-4 active:bg-accent"
    >
      <Icon size={20} color={destructive ? colors.destructive : colors.mutedForeground} />
      <Text className={destructive ? 'flex-1 text-destructive' : 'flex-1'}>{label}</Text>
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
