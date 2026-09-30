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
}: {
  name: string;
  size?: number;
  color: string;
}) {
  const Icon = icons[name] ?? Sparkles;
  return <Icon size={size} color={color} />;
}

/** A category's accent colours (UX_GUIDELINES "Category accents"); neutral for unknown ones. */
export function accentOf(accent: string): { solid: string; bg: string; fg: string } {
  return (
    (categoryAccents as Record<string, { solid: string; bg: string; fg: string }>)[accent] ??
    categoryAccents.outdoor
  );
}
