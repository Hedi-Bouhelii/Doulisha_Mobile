import {
  Baby,
  Briefcase,
  Heart,
  Mountain,
  Music,
  Palette,
  PartyPopper,
  Sparkles,
  Volleyball,
  type LucideIcon,
} from 'lucide-react-native';

import { categoryAccents } from '@/shared/web/ui-tokens/tokens';
import { useScheme } from '@/theme/theme-provider';

/** Icon names stored on categories (web: packages/templates/src/categories.ts). */
const icons: Record<string, LucideIcon> = {
  mountain: Mountain,
  volleyball: Volleyball,
  music: Music,
  palette: Palette,
  'party-popper': PartyPopper,
  heart: Heart,
  briefcase: Briefcase,
  baby: Baby,
};

export function CategoryIcon({
  name,
  size = 20,
  color,
  strokeWidth,
}: {
  name: string;
  size?: number;
  color: string;
  strokeWidth?: number;
}) {
  const Icon = icons[name] ?? Sparkles;
  return <Icon size={size} color={color} strokeWidth={strokeWidth} />;
}

type Accent = { solid: string; bg: string; fg: string };

/** A category's accent colours (UX_GUIDELINES "Category accents"); outdoor for unknown ones. */
export function accentOf(accent: string): Accent {
  return (categoryAccents as Record<string, Accent>)[accent] ?? categoryAccents.outdoor;
}

/**
 * The accent for the current theme. The pale tile colours glare on dark
 * surfaces, so the dark theme uses the solid colour, softened, with cream text.
 */
export function useAccent(accent: string): Accent {
  const colors = accentOf(accent);
  return useScheme() === 'dark'
    ? { solid: colors.solid, bg: `${colors.solid}40`, fg: '#F5F0E8' }
    : colors;
}
