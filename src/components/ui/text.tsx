import { Text as NativeText, type TextProps as NativeTextProps } from 'react-native';

import { useLocale } from '@/i18n';
import { cn } from '@/lib/cn';
import { ARABIC_LINE_HEIGHT, fontFamily, type FontRole, type FontWeight } from '@/theme/fonts';

const sizes = { xs: 12, sm: 14, base: 16, lg: 18, xl: 20, '2xl': 24, '3xl': 30 } as const;
export type TextSize = keyof typeof sizes;

export interface TextProps extends NativeTextProps {
  /** `display`: Playfair Display / Amiri headlines. */
  font?: FontRole;
  weight?: FontWeight;
  size?: TextSize;
  className?: string;
}

/**
 * All interface text. It picks the font for the interface language (Inter or
 * IBM Plex Sans Arabic, Playfair Display or Amiri) and gives Arabic body text
 * its taller lines (UX_GUIDELINES). Colours come from `className`.
 */
export function Text({
  font = 'body',
  weight = 'regular',
  size = 'base',
  className,
  style,
  ...props
}: TextProps) {
  const arabic = useLocale() === 'ar';
  const fontSize = sizes[size];
  const body = font === 'body';
  const lineRatio = arabic ? (body ? ARABIC_LINE_HEIGHT : 1.5) : body ? 1.45 : 1.2;
  return (
    <NativeText
      className={cn('text-foreground', className)}
      style={[
        {
          fontFamily: fontFamily(arabic ? 'arabic' : 'latin', font, weight),
          fontSize,
          lineHeight: Math.round(fontSize * lineRatio),
        },
        style,
      ]}
      maxFontSizeMultiplier={1.6}
      {...props}
    />
  );
}
