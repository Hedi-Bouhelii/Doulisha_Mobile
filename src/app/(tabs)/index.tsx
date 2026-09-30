import { FlashList } from '@shopify/flash-list';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { CalendarSearch, UserRound, WifiOff } from 'lucide-react-native';
import { Image, Pressable, RefreshControl, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { EventCard, EventCardSkeleton } from '@/components/doulisha/event-card';
import { EmptyState } from '@/components/ui/empty-state';
import { Text } from '@/components/ui/text';
import { useMe, useSession } from '@/features/auth/session';
import { useLocale, useT } from '@/i18n';
import { useErrorMessage } from '@/i18n/errors';
import { API_URL } from '@/lib/config';
import { initials } from '@/lib/initials';
import { useTRPC } from '@/lib/trpc';
import { useColors } from '@/theme/theme-provider';

const symbol = require('@/assets/images/symbol.png') as number;

/** Logo and wordmark, and a way to the account: "Sign in" or the person's initials. */
function BrandBar() {
  const tNav = useT('Nav');
  const tApp = useT('App');
  const router = useRouter();
  const { data: session } = useSession();
  const { data: me } = useMe();
  const colors = useColors();
  const member = session && !session.user.isAnonymous;
  const letters = member ? initials(me?.name ?? session.user.name) : '';
  return (
    <View className="flex-row items-center justify-between pb-6">
      <View className="flex-row items-center gap-2.5" accessibilityRole="header">
        <Image source={symbol} style={{ width: 36, height: 24 }} resizeMode="contain" />
        <Text
          font="display"
          weight="bold"
          size="2xl"
          style={{ fontFamily: 'PlayfairDisplay_700Bold' }}
        >
          Doulisha
        </Text>
      </View>
      {member ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={tApp('tabAccount')}
          onPress={() => router.navigate('/account')}
          className="h-11 w-11 items-center justify-center rounded-full bg-primary"
        >
          {letters ? (
            <Text weight="bold" className="text-primary-foreground" maxFontSizeMultiplier={1.2}>
              {letters}
            </Text>
          ) : (
            <UserRound size={22} color={colors.primaryForeground} />
          )}
        </Pressable>
      ) : (
        <Pressable
          accessibilityRole="button"
          onPress={() => router.push('/sign-in')}
          className="min-h-11 justify-center rounded-full border-[1.5px] border-border bg-card px-4"
          testID="discover-sign-in"
        >
          <Text size="sm" weight="semibold" maxFontSizeMultiplier={1.3}>
            {tNav('signIn')}
          </Text>
        </Pressable>
      )}
    </View>
  );
}

/**
 * Discover (DSC-02). Part 3a lists upcoming public events; the rails,
 * categories, search and the native event page come in part 3b.
 */
export default function DiscoverScreen() {
  const t = useT('App');
  const tStates = useT('States');
  const locale = useLocale();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const errorMessage = useErrorMessage();
  const trpc = useTRPC();
  const { data: me } = useMe();
  const events = useQuery(trpc.events.upcoming.queryOptions({ limit: 20 }));
  // No greeting while the account is still named after its phone number (before setup).
  const firstName = me && !me.isAnonymous && initials(me.name) ? me.name.split(/\s+/)[0] : null;

  const header = (
    <View>
      <BrandBar />
      <Animated.View entering={FadeInDown.duration(250)} className="gap-2 pb-8">
        {firstName ? (
          <Text weight="semibold" className="text-highlight">
            {t('hello', { name: firstName })}
          </Text>
        ) : null}
        <Text font="display" weight="bold" size="4xl" accessibilityRole="header">
          {t('discoverTitle')}
        </Text>
        <Text className="text-muted-foreground">{t('upcomingSubtitle')}</Text>
      </Animated.View>
      <View className="flex-row items-end justify-between pb-4">
        <Text size="xl" weight="bold">
          {t('upcomingTitle')}
        </Text>
        {events.data ? (
          <Text size="sm" className="text-muted-foreground">
            {t('eventsCount', { count: events.data.length })}
          </Text>
        ) : null}
      </View>
    </View>
  );

  const padding = { paddingTop: insets.top + 12, paddingHorizontal: 20, paddingBottom: 32 };

  if (events.isPending) {
    return (
      <View className="flex-1 gap-5 bg-background" style={padding}>
        {header}
        <EventCardSkeleton />
        <EventCardSkeleton />
      </View>
    );
  }

  if (events.isError) {
    return (
      <View className="flex-1 bg-background" style={padding}>
        <BrandBar />
        <View className="flex-1 justify-center">
          <EmptyState
            icon={WifiOff}
            tone="alert"
            title={tStates('errorTitle')}
            hint={errorMessage(events.error)}
            actionLabel={tStates('retry')}
            onAction={() => void events.refetch()}
          />
        </View>
      </View>
    );
  }

  return (
    <FlashList
      data={events.data}
      keyExtractor={(event) => event.id}
      className="flex-1 bg-background"
      contentContainerStyle={padding}
      ListHeaderComponent={header}
      ItemSeparatorComponent={() => <View className="h-5" />}
      showsVerticalScrollIndicator={false}
      ListEmptyComponent={
        <EmptyState
          icon={CalendarSearch}
          title={tStates('emptyEventsTitle')}
          hint={tStates('emptyEventsHint')}
        />
      }
      refreshControl={
        <RefreshControl
          refreshing={events.isRefetching}
          onRefresh={() => void events.refetch()}
          tintColor={colors.primary}
          colors={[colors.primary]}
          progressViewOffset={insets.top}
        />
      }
      renderItem={({ item }) => (
        <EventCard
          event={item}
          // The native event page arrives in part 3b; until then, the web page.
          onPress={() =>
            void WebBrowser.openBrowserAsync(`${API_URL}/${locale}/events/${item.slug}`)
          }
        />
      )}
    />
  );
}
