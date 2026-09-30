import * as Haptics from 'expo-haptics';
import type { ReactNode } from 'react';
import { ActivityIndicator, View, type PressableProps } from 'react-native';

import { cn } from '@/lib/cn';
import { useColors } from '@/theme/theme-provider';

import { PressableScale } from './pressable-scale';
import { Text, type TextSize } from './text';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'link' | 'destructive';
type Size = 'sm' | 'md' | 'lg';

const containers: Record<Variant, string> = {
  primary: 'bg-primary',
  secondary: 'bg-secondary',
  outline: 'border-[1.5px] border-border bg-card',
  ghost: 'bg-transparent',
  link: 'bg-transparent',
  destructive: 'bg-destructive',
};

const labels: Record<Variant, string> = {
  primary: 'text-primary-foreground',
  secondary: 'text-secondary-foreground',
  outline: 'text-foreground',
  ghost: 'text-foreground',
  link: 'text-primary',
  destructive: 'text-destructive-foreground',
};

const heights: Record<Size, string> = {
  sm: 'min-h-11 px-4 py-2',
  md: 'min-h-[52px] px-5 py-3',
  lg: 'min-h-14 px-6 py-3.5',
};

const textSizes: Record<Size, TextSize> = { sm: 'sm', md: 'base', lg: 'lg' };

export interface ButtonProps extends Omit<PressableProps, 'children'> {
  label: string;
  variant?: Variant;
  size?: Size;
  /** Shows a spinner and ignores taps while an action runs. */
  busy?: boolean;
  icon?: ReactNode;
  /** Stretches to the width of its container (default for form buttons). */
  block?: boolean;
  className?: string;
}

/**
 * Buttons are at least 44 px high (UX_GUIDELINES); labels stay centred and
 * wrap inside the button instead of spilling out. Main actions give a light
 * haptic tap. "Never a silent disabled button": keep it active and say what
 * is missing.
 */
export function Button({
  label,
  variant = 'primary',
  size = 'md',
  busy = false,
  disabled,
  icon,
  block = true,
  className,
  onPress,
  ...props
}: ButtonProps) {
  const colors = useColors();
  const inactive = disabled || busy;
  const spinner =
    variant === 'primary'
      ? colors.primaryForeground
      : variant === 'destructive'
        ? colors.destructiveForeground
        : colors.primary;
  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: !!inactive, busy }}
      disabled={inactive}
      containerStyle={block ? { alignSelf: 'stretch' } : { alignSelf: 'flex-start' }}
      onPress={(event) => {
        if (variant === 'primary' || variant === 'destructive') {
          void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        onPress?.(event);
      }}
      className={cn(
        'flex-row items-center justify-center gap-2.5 rounded-full',
        heights[size],
        variant === 'link' && 'min-h-11 px-2 py-2',
        containers[variant],
        inactive && 'opacity-60',
        className,
      )}
      {...props}
    >
      {busy ? <ActivityIndicator color={spinner} /> : icon ? <View>{icon}</View> : null}
      <Text
        size={textSizes[size]}
        weight="semibold"
        numberOfLines={2}
        className={cn('shrink text-center', labels[variant])}
      >
        {label}
      </Text>
    </PressableScale>
  );
}

/** A round 44 px button with only an icon (back, close, menus); the label is for screen readers. */
export function IconButton({
  icon,
  label,
  onPress,
  variant = 'ghost',
  className,
  testID,
}: {
  icon: ReactNode;
  label: string;
  onPress: () => void;
  variant?: 'ghost' | 'filled';
  className?: string;
  testID?: string;
}) {
  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      hitSlop={4}
      testID={testID}
      scaleTo={0.92}
      className={cn(
        'h-11 w-11 items-center justify-center rounded-full',
        variant === 'filled' ? 'bg-card' : 'bg-transparent',
        className,
      )}
    >
      {icon}
    </PressableScale>
  );
}
