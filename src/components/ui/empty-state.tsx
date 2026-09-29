import type { LucideIcon } from 'lucide-react-native';
import { View } from 'react-native';

import { cn } from '@/lib/cn';
import { useColors } from '@/theme/theme-provider';

import { Button } from './button';
import { Text } from './text';

/**
 * Empty and error states (UX_GUIDELINES "Required states"): an icon, a title,
 * a hint and one next action. `tone="alert"` for errors.
 */
export function EmptyState({
  icon: Icon,
  title,
  hint,
  actionLabel,
  onAction,
  tone = 'default',
  className,
}: {
  icon: LucideIcon;
  title: string;
  hint?: string;
  actionLabel?: string;
  onAction?: () => void;
  tone?: 'default' | 'alert';
  className?: string;
}) {
  const colors = useColors();
  const alert = tone === 'alert';
  return (
    <View className={cn('items-center gap-3 px-6 py-12', className)}>
      <View
        className={cn(
          'h-16 w-16 items-center justify-center rounded-full',
          alert ? 'bg-highlight-soft' : 'bg-secondary',
        )}
      >
        <Icon size={28} color={alert ? colors.highlight : colors.primary} />
      </View>
      <Text
        font="display"
        weight="bold"
        size="xl"
        className="text-center"
        accessibilityRole="header"
      >
        {title}
      </Text>
      {hint ? <Text className="text-center text-muted-foreground">{hint}</Text> : null}
      {actionLabel && onAction ? (
        <Button label={actionLabel} onPress={onAction} className="mt-2" />
      ) : null}
    </View>
  );
}
