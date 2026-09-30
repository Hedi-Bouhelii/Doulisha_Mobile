import type { LucideIcon } from 'lucide-react-native';
import { useCallback, useRef, useState, type ReactNode } from 'react';
import { Modal, Pressable, View } from 'react-native';
import Animated, { FadeIn, FadeOut, SlideInDown, SlideOutDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { cn } from '@/lib/cn';
import { useColors } from '@/theme/theme-provider';

import { Button } from './button';
import { Text } from './text';

export interface ConfirmOptions {
  title: string;
  body?: string;
  confirmLabel: string;
  cancelLabel: string;
  icon?: LucideIcon;
  /** Red confirm button, for sign-out, blocking, cancelling. */
  destructive?: boolean;
}

/**
 * A bottom sheet that asks before an important action, in the app's own look
 * (instead of Android's grey dialog). `confirm()` resolves true or false.
 */
export function useConfirm(): [ReactNode, (options: ConfirmOptions) => Promise<boolean>] {
  const [options, setOptions] = useState<ConfirmOptions | null>(null);
  const resolver = useRef<((value: boolean) => void) | null>(null);

  const confirm = useCallback((next: ConfirmOptions) => {
    setOptions(next);
    return new Promise<boolean>((resolve) => {
      resolver.current = resolve;
    });
  }, []);

  const close = useCallback((value: boolean) => {
    resolver.current?.(value);
    resolver.current = null;
    setOptions(null);
  }, []);

  const element = <ConfirmSheet options={options} onClose={close} />;
  return [element, confirm];
}

function ConfirmSheet({
  options,
  onClose,
}: {
  options: ConfirmOptions | null;
  onClose: (value: boolean) => void;
}) {
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const Icon = options?.icon;
  return (
    <Modal
      visible={!!options}
      transparent
      animationType="none"
      statusBarTranslucent
      navigationBarTranslucent
      onRequestClose={() => onClose(false)}
    >
      {options ? (
        <View className="flex-1 justify-end">
          <Animated.View
            entering={FadeIn.duration(200)}
            exiting={FadeOut.duration(150)}
            className="absolute inset-0"
          >
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={options.cancelLabel}
              onPress={() => onClose(false)}
              className="flex-1 bg-black/45"
            />
          </Animated.View>
          <Animated.View
            entering={SlideInDown.duration(250)}
            exiting={SlideOutDown.duration(200)}
            accessibilityViewIsModal
            className="gap-5 rounded-t-3xl bg-card px-6 pt-3"
            style={{ paddingBottom: insets.bottom + 20 }}
          >
            <View className="h-1.5 w-10 self-center rounded-full bg-border" />
            {Icon ? (
              <View
                className={cn(
                  'h-14 w-14 items-center justify-center rounded-full',
                  options.destructive ? 'bg-highlight-soft' : 'bg-secondary',
                )}
              >
                <Icon size={26} color={options.destructive ? colors.highlight : colors.primary} />
              </View>
            ) : null}
            <View className="gap-2">
              <Text font="display" weight="bold" size="2xl" accessibilityRole="header">
                {options.title}
              </Text>
              {options.body ? <Text className="text-muted-foreground">{options.body}</Text> : null}
            </View>
            <View className="gap-2">
              <Button
                label={options.confirmLabel}
                variant={options.destructive ? 'destructive' : 'primary'}
                onPress={() => onClose(true)}
                testID="confirm-yes"
              />
              <Button
                label={options.cancelLabel}
                variant="ghost"
                onPress={() => onClose(false)}
                testID="confirm-no"
              />
            </View>
          </Animated.View>
        </View>
      ) : null}
    </Modal>
  );
}
