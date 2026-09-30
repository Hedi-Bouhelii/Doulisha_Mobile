import {
  Text as NativeText,
  useWindowDimensions,
  type TextProps as NativeTextProps,
} from 'react-native';

import { useLocale } from '@/i18n';
import { cn } from '@/lib/cn';
import { hasTextColour } from '@/lib/text-colour';
import { ARABIC_LINE_HEIGHT, fontFamily, type FontRole, type FontWeight } from '@/theme/fonts';

const sizes = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
} as const;
export type TextSize = keyof typeof sizes;

/** Largest text size the phone's accessibility setting may reach before layouts break. */
const MAX_FONT_SCALE = 1.5;

export interface TextProps extends NativeTextProps {
  /** `display`: Playfair Display / Amiri headlines. */
  font?: FontRole;
  weight?: FontWeight;
  size?: TextSize;
  className?: string;
}

/**
 * All interface text. It picks the font for the interface language (Inter or
 * IBM Plex Sans Arabic, Playfair Display or Amiri), gives Arabic body text its
 * taller lines (UX_GUIDELINES), and grows the line height with the phone's
 * font size so large text never spills out of its button or card.
 */
export function Text({
  font = 'body',
  weight = 'regular',
  size = 'base',
  className,
  style,
  maxFontSizeMultiplier = MAX_FONT_SCALE,
  ...props
}: TextProps) {
  const arabic = useLocale() === 'ar';
  const { fontScale } = useWindowDimensions();
  const fontSize = sizes[size];
  const body = font === 'body';
  const lineRatio = arabic ? (body ? ARABIC_LINE_HEIGHT : 1.55) : body ? 1.45 : 1.2;
  const scale = Math.min(fontScale, maxFontSizeMultiplier ?? MAX_FONT_SCALE);
  return (
    <NativeText
      className={cn(!hasTextColour(className) && 'text-foreground', className)}
      style={[
        {
          fontFamily: fontFamily(arabic ? 'arabic' : 'latin', font, weight),
          fontSize,
          lineHeight: Math.ceil(fontSize * lineRatio * scale),
        },
        style,
      ]}
      maxFontSizeMultiplier={maxFontSizeMultiplier}
      {...props}
    />
  );
}
