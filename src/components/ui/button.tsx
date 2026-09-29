import type { ReactNode } from 'react';
import { ActivityIndicator, Pressable, View, type PressableProps } from 'react-native';

import { cn } from '@/lib/cn';
import { useColors } from '@/theme/theme-provider';

import { Text } from './text';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'link';

const containers: Record<Variant, string> = {
  primary: 'bg-primary',
  secondary: 'bg-secondary',
  outline: 'border border-border bg-card',
  ghost: 'bg-transparent',
  link: 'bg-transparent',
};

const labels: Record<Variant, string> = {
  primary: 'text-primary-foreground',
  secondary: 'text-secondary-foreground',
  outline: 'text-foreground',
  ghost: 'text-foreground',
  link: 'text-primary',
};

export interface ButtonProps extends Omit<PressableProps, 'children'> {
  label: string;
  variant?: Variant;
  /** Shows a spinner and ignores taps while an action runs. */
  busy?: boolean;
  icon?: ReactNode;
  className?: string;
}

/**
 * Buttons are at least 48 px high (touch targets of 44 px or more,
 * UX_GUIDELINES). "Never a silent disabled button": prefer keeping the button
 * active and saying what is missing.
 */
export function Button({
  label,
  variant = 'primary',
  busy = false,
  disabled,
  icon,
  className,
  ...props
}: ButtonProps) {
  const colors = useColors();
  const inactive = disabled || busy;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: !!inactive, busy }}
      disabled={inactive}
      className={cn(
        'min-h-12 flex-row items-center justify-center gap-2 rounded-full px-5 active:opacity-80',
        containers[variant],
        inactive && 'opacity-60',
        className,
      )}
      {...props}
    >
      {busy ? (
        <ActivityIndicator
          color={variant === 'primary' ? colors.primaryForeground : colors.primary}
        />
      ) : icon ? (
        <View>{icon}</View>
      ) : null}
      <Text weight="semibold" className={labels[variant]}>
        {label}
      </Text>
    </Pressable>
  );
}
