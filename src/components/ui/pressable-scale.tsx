import type { ReactNode } from 'react';
import { Pressable, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

/**
 * A pressable that shrinks slightly under the finger (150 ms, UX_GUIDELINES
 * motion), and stays still when the phone asks for reduced motion.
 */
export function PressableScale({
  children,
  scaleTo = 0.97,
  containerStyle,
  onPressIn,
  onPressOut,
  ...props
}: PressableProps & {
  children: ReactNode;
  scaleTo?: number;
  containerStyle?: StyleProp<ViewStyle>;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();
  const scale = useSharedValue(1);
  const style = useAnimatedStyle(() => ({ transform: [{ scale: scale.get() }] }));
  return (
    <Animated.View style={[style, containerStyle]}>
      <Pressable
        onPressIn={(event) => {
          if (!reduceMotion) scale.set(withTiming(scaleTo, { duration: 150 }));
          onPressIn?.(event);
        }}
        onPressOut={(event) => {
          scale.set(withTiming(1, { duration: 150 }));
          onPressOut?.(event);
        }}
        {...props}
      >
        {children}
      </Pressable>
    </Animated.View>
  );
}
