import { Image } from 'expo-image';
import { Clock, MapPin, Users } from 'lucide-react-native';
import { View } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

import { PressableScale } from '@/components/ui/pressable-scale';
import { Skeleton } from '@/components/ui/skeleton';
import { Text } from '@/components/ui/text';
import { useLocale, useT } from '@/i18n';
import { cn } from '@/lib/cn';
import { dateBadge } from '@/lib/dates';
import { absoluteUrl } from '@/lib/urls';
import type { RouterOutputs } from '@/shared/web/api-types';
import { formatEventDateTime, formatTime } from '@/shared/web/i18n';
import { useColors, useElevation } from '@/theme/theme-provider';

import { CategoryIcon, useAccent } from './category';
import { PriceTag } from './price-tag';

export type EventCardData = RouterOutputs['events']['upcoming'][number];

/** Darkens the bottom of the photo so the category label stays readable on any picture. */
function PhotoShade() {
  return (
    <Svg
      style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '55%' }}
      preserveAspectRatio="none"
    >
      <Defs>
        <LinearGradient id="shade" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#15120F" stopOpacity="0" />
          <Stop offset="1" stopColor="#15120F" stopOpacity="0.6" />
        </LinearGradient>
      </Defs>
      <Rect width="100%" height="100%" fill="url(#shade)" />
    </Svg>
  );
}

/**
 * Event card (web: EventCard, template "Trending events"): a large photo with
 * the date badge and the category, then the title, place and time, people
 * going and the price. The whole card is one button.
 */
export function EventCard({
  event,
  onPress,
  className,
}: {
  event: EventCardData;
  onPress: () => void;
  className?: string;
}) {
  const t = useT('Event');
  const locale = useLocale();
  const colors = useColors();
  const accent = useAccent(event.category.accent);
  const elevation = useElevation('card');
  const isFull = event.placesLeft === 0;
  const fewLeft =
    !isFull && event.capacity !== null && event.placesLeft !== null && event.placesLeft <= 5;
  const badge = dateBadge(event.startsAt, locale);
  const place = event.city ?? event.venueName;

  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityLabel={`${event.title}. ${place ? `${place}, ` : ''}${formatEventDateTime(event.startsAt, locale)}`}
      onPress={onPress}
      scaleTo={0.98}
      className={cn('overflow-hidden rounded-3xl border border-border bg-card', className)}
      style={elevation}
    >
      <View className="aspect-[16/11] bg-muted">
        {event.coverUrl ? (
          <Image
            source={{ uri: absoluteUrl(event.coverUrl) }}
            style={{ width: '100%', height: '100%' }}
            contentFit="cover"
            transition={200}
            recyclingKey={event.id}
            accessibilityIgnoresInvertColors
          />
        ) : (
          <View
            className="flex-1 items-center justify-center"
            style={{ backgroundColor: accent.bg }}
          >
            <CategoryIcon
              name={event.category.icon}
              size={56}
              color={accent.fg}
              strokeWidth={1.5}
            />
          </View>
        )}
        {event.coverUrl ? <PhotoShade /> : null}

        {/* Calendar badge: day and month at a glance. */}
        <View className="absolute start-3 top-3 min-w-[54px] items-center rounded-2xl bg-card px-2.5 py-1.5">
          <Text
            size="xs"
            weight="bold"
            className="uppercase text-highlight"
            maxFontSizeMultiplier={1.2}
          >
            {badge.month}
          </Text>
          <Text size="xl" weight="bold" style={{ marginTop: -2 }} maxFontSizeMultiplier={1.2}>
            {badge.day}
          </Text>
        </View>

        {isFull || fewLeft ? (
          <View
            className={cn(
              'absolute end-3 top-3 rounded-full px-3 py-1.5',
              isFull ? 'bg-foreground' : 'bg-highlight',
            )}
          >
            <Text
              size="xs"
              weight="bold"
              className={isFull ? 'text-background' : 'text-highlight-foreground'}
              maxFontSizeMultiplier={1.2}
            >
              {isFull ? t('full') : t('placesLeft', { count: event.placesLeft ?? 0 })}
            </Text>
          </View>
        ) : null}

        {event.coverUrl ? (
          <View className="absolute bottom-3 start-3 flex-row gap-1.5">
            <View className="flex-row items-center gap-1.5 rounded-full bg-black/35 px-3 py-1.5">
              <CategoryIcon name={event.category.icon} size={13} color="#FFFFFF" />
              <Text
                size="xs"
                weight="semibold"
                style={{ color: '#FFFFFF' }}
                maxFontSizeMultiplier={1.2}
              >
                {event.category.name}
              </Text>
            </View>
          </View>
        ) : null}
      </View>

      <View className="gap-2.5 p-4">
        <Text size="lg" weight="bold" numberOfLines={2}>
          {event.title}
        </Text>
        <View className="flex-row flex-wrap items-center gap-x-3 gap-y-1">
          {place ? (
            <View className="flex-row items-center gap-1">
              <MapPin size={15} color={colors.mutedForeground} />
              <Text size="sm" className="text-muted-foreground" numberOfLines={1}>
                {place}
              </Text>
            </View>
          ) : null}
          <View className="flex-row items-center gap-1">
            <Clock size={15} color={colors.mutedForeground} />
            <Text size="sm" className="text-muted-foreground">
              {formatTime(event.startsAt, locale)}
            </Text>
          </View>
          <View className="rounded-md px-2 py-0.5" style={{ backgroundColor: accent.bg }}>
            <Text size="xs" weight="semibold" style={{ color: accent.fg }}>
              {event.templateName}
            </Text>
          </View>
        </View>
        <View className="mt-1 flex-row items-center justify-between gap-3 border-t border-border pt-3">
          <View className="shrink flex-row items-center gap-1.5">
            <Users size={16} color={colors.highlight} />
            <Text
              size="sm"
              weight="medium"
              className="shrink text-muted-foreground"
              numberOfLines={1}
            >
              {t('going', { count: event.placesTaken })}
            </Text>
          </View>
          <View className="rounded-full bg-primary/10 px-3.5 py-1.5">
            <PriceTag millimes={event.priceFromMillimes} className="text-primary" />
          </View>
        </View>
      </View>
    </PressableScale>
  );
}

/** Loading placeholder with the same shape as EventCard. */
export function EventCardSkeleton() {
  return (
    <View className="overflow-hidden rounded-3xl border border-border bg-card">
      <Skeleton className="aspect-[16/11] rounded-none" />
      <View className="gap-3 p-4">
        <Skeleton className="h-5 w-4/5" />
        <Skeleton className="h-4 w-3/5" />
        <View className="flex-row justify-between border-t border-border pt-3">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-7 w-28 rounded-full" />
        </View>
      </View>
    </View>
  );
}
