import type { LucideIcon } from 'lucide-react-native';
import { View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { cn } from '@/lib/cn';
import { useColors } from '@/theme/theme-provider';

import { Button } from './button';
import { Text } from './text';

/**
 * Empty and error states (UX_GUIDELINES "Required states"): an illustration,
 * a title, a hint and one next action. `tone="alert"` for errors.
 */
export function EmptyState({
  icon: Icon,
  title,
  hint,
  actionLabel,
  onAction,
  secondaryLabel,
  onSecondary,
  tone = 'default',
  className,
}: {
  icon: LucideIcon;
  title: string;
  hint?: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryLabel?: string;
  onSecondary?: () => void;
  tone?: 'default' | 'alert';
  className?: string;
}) {
  const colors = useColors();
  const alert = tone === 'alert';
  return (
    <Animated.View
      entering={FadeIn.duration(250)}
      className={cn('items-center gap-4 px-6 py-10', className)}
    >
      {/* Two soft rings around the icon: a light illustration without image files. */}
      <View
        className={cn(
          'h-32 w-32 items-center justify-center rounded-full',
          alert ? 'bg-highlight-soft/60' : 'bg-primary/5',
        )}
      >
        <View
          className={cn(
            'h-24 w-24 items-center justify-center rounded-full',
            alert ? 'bg-highlight-soft' : 'bg-secondary',
          )}
        >
          <Icon size={40} color={alert ? colors.highlight : colors.primary} strokeWidth={1.75} />
        </View>
      </View>
      <View className="gap-2">
        <Text
          font="display"
          weight="bold"
          size="2xl"
          className="text-center"
          accessibilityRole="header"
        >
          {title}
        </Text>
        {hint ? <Text className="text-center text-muted-foreground">{hint}</Text> : null}
      </View>
      {actionLabel && onAction ? (
        <View className="gap-2 self-stretch pt-2">
          <Button label={actionLabel} size="lg" onPress={onAction} />
          {secondaryLabel && onSecondary ? (
            <Button variant="outline" label={secondaryLabel} onPress={onSecondary} />
          ) : null}
        </View>
      ) : null}
    </Animated.View>
  );
}
