import { Image } from 'expo-image';
import { Pressable, View } from 'react-native';

import { Skeleton } from '@/components/ui/skeleton';
import { Text } from '@/components/ui/text';
import { useLocale, useT } from '@/i18n';
import { cn } from '@/lib/cn';
import { absoluteUrl } from '@/lib/urls';
import type { RouterOutputs } from '@/shared/web/api-types';
import { formatEventDateTime } from '@/shared/web/i18n';

import { accentOf, CategoryIcon } from './category';
import { PriceTag } from './price-tag';

export type EventCardData = RouterOutputs['events']['upcoming'][number];

/**
 * Event card (web: EventCard): photo, title, city and date, category and
 * template, people going and price. The whole card is one button.
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
  const accent = accentOf(event.category.accent);
  const isFull = event.placesLeft === 0;
  const fewLeft =
    !isFull && event.capacity !== null && event.placesLeft !== null && event.placesLeft <= 5;
  const when = formatEventDateTime(event.startsAt, locale);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${event.title}, ${event.city ? `${event.city}, ` : ''}${when}`}
      onPress={onPress}
      className={cn(
        'overflow-hidden rounded-xl border border-border bg-card active:opacity-90',
        className,
      )}
    >
      <View className="aspect-[4/3] bg-muted">
        {event.coverUrl ? (
          <Image
            source={{ uri: absoluteUrl(event.coverUrl) }}
            style={{ width: '100%', height: '100%' }}
            contentFit="cover"
            transition={150}
            accessibilityIgnoresInvertColors
          />
        ) : (
          <View
            className="flex-1 items-center justify-center"
            style={{ backgroundColor: accent.bg }}
          >
            <CategoryIcon name={event.category.icon} size={40} color={accent.fg} />
          </View>
        )}
        {isFull || fewLeft ? (
          <View
            className={cn(
              'absolute start-3 top-3 rounded-full px-2.5 py-1',
              isFull ? 'bg-foreground' : 'bg-highlight',
            )}
          >
            <Text
              size="xs"
              weight="semibold"
              className={isFull ? 'text-background' : 'text-highlight-foreground'}
            >
              {isFull ? t('full') : t('placesLeft', { count: event.placesLeft ?? 0 })}
            </Text>
          </View>
        ) : null}
      </View>

      <View className="gap-2 p-3">
        <Text weight="semibold" numberOfLines={2}>
          {event.title}
        </Text>
        <Text size="sm" className="text-muted-foreground">
          {event.city ? `${event.city} · ` : ''}
          {when}
        </Text>
        <View className="flex-row flex-wrap gap-1.5">
          <View className="rounded-md px-2 py-0.5" style={{ backgroundColor: accent.bg }}>
            <Text size="xs" weight="medium" style={{ color: accent.fg }}>
              {event.category.name}
            </Text>
          </View>
          <View className="rounded-md bg-muted px-2 py-0.5">
            <Text size="xs" weight="medium" className="text-muted-foreground">
              {event.templateName}
            </Text>
          </View>
        </View>
        <View className="flex-row items-center justify-between gap-2 pt-1">
          <View className="flex-row items-center gap-1.5">
            <View className="h-2 w-2 rounded-full bg-highlight" />
            <Text size="sm" className="text-muted-foreground">
              {t('going', { count: event.placesTaken })}
            </Text>
          </View>
          <PriceTag millimes={event.priceFromMillimes} />
        </View>
      </View>
    </Pressable>
  );
}

/** Loading placeholder with the same shape as EventCard. */
export function EventCardSkeleton() {
  return (
    <View className="overflow-hidden rounded-xl border border-border bg-card">
      <Skeleton className="aspect-[4/3] rounded-none" />
      <View className="gap-2 p-3">
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-3 w-3/5" />
        <View className="flex-row gap-1.5">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-20" />
        </View>
        <Skeleton className="h-4 w-full" />
      </View>
    </View>
  );
}
