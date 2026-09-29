import { FlashList } from '@shopify/flash-list';
import { useQuery } from '@tanstack/react-query';
import * as WebBrowser from 'expo-web-browser';
import { CalendarSearch, WifiOff } from 'lucide-react-native';
import { RefreshControl, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { EventCard, EventCardSkeleton } from '@/components/doulisha/event-card';
import { EmptyState } from '@/components/ui/empty-state';
import { Text } from '@/components/ui/text';
import { useLocale, useT } from '@/i18n';
import { useErrorMessage } from '@/i18n/errors';
import { API_URL } from '@/lib/config';
import { useTRPC } from '@/lib/trpc';
import { useColors } from '@/theme/theme-provider';

/**
 * Discover (DSC-02). Part 3a lists upcoming public events; the rails,
 * categories, search and the event page come in part 3b.
 */
export default function DiscoverScreen() {
  const t = useT('App');
  const tStates = useT('States');
  const locale = useLocale();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const errorMessage = useErrorMessage();
  const trpc = useTRPC();
  const events = useQuery(trpc.events.upcoming.queryOptions({ limit: 20 }));

  const header = (
    <View className="gap-1 pb-4">
      <Text font="display" weight="bold" size="3xl" accessibilityRole="header">
        {t('upcomingTitle')}
      </Text>
      <Text className="text-muted-foreground">{t('upcomingSubtitle')}</Text>
    </View>
  );

  if (events.isPending) {
    return (
      <View className="flex-1 gap-4 bg-background px-4" style={{ paddingTop: insets.top + 16 }}>
        {header}
        <EventCardSkeleton />
        <EventCardSkeleton />
      </View>
    );
  }

  if (events.isError) {
    return (
      <View className="flex-1 justify-center bg-background" style={{ paddingTop: insets.top }}>
        <EmptyState
          icon={WifiOff}
          tone="alert"
          title={tStates('errorTitle')}
          hint={errorMessage(events.error)}
          actionLabel={tStates('retry')}
          onAction={() => void events.refetch()}
        />
      </View>
    );
  }

  return (
    <FlashList
      data={events.data}
      keyExtractor={(event) => event.id}
      className="flex-1 bg-background"
      contentContainerStyle={{
        paddingTop: insets.top + 16,
        paddingHorizontal: 16,
        paddingBottom: 24,
      }}
      ListHeaderComponent={header}
      ItemSeparatorComponent={() => <View className="h-4" />}
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
