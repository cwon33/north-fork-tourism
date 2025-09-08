import { formatMMDD_hhmm, toDate } from '@components/dateFormatter';
import EventCard from '@components/ui/eventsCard';
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from 'firebase/firestore';
import { db } from 'FirebaseConfig';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  ActivityIndicator,
  FlatList,
  ListRenderItemInfo,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { Events } from '@components/types';
import { useRouter } from 'expo-router';

const CATEGORIES = ['Today', 'Upcomming'];

export default function EventsScreen() {
  const [events, setEvents] = useState<Events[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('Today');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const unsubRef = useRef<(() => void) | null>(null);

  const startOfToday = () => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  };
  const endOfToday = () => {
    const d = new Date();
    d.setHours(23, 59, 59, 999);
    return d;
  };

  // derive a Firestore query based on selected category
  const fetchEvents = useCallback(() => {
    const col = collection(db, 'events');
    const start = startOfToday();
    const end = endOfToday();
    if (selectedCategory === 'Today') {
      return query(
        col,
        where('startAt', '<=', end), // event started before the day ends
        where('endAt', '>=', start), // and ends after the day starts  -> overlaps today
        orderBy('startAt', 'asc'), // add whatever order you prefer
      );
    }
    return query(col, where('startAt', '>=', end), orderBy('startAt', 'asc'));
  }, [selectedCategory]);

  // subscribe to Firestore in real-time
  useEffect(() => {
    setLoading(true);
    // clean up previous subscription
    unsubRef.current?.();

    const q = fetchEvents();
    const unsub = onSnapshot(
      q,
      (snap) => {
        const items: Events[] = [];
        snap.forEach((doc) => {
          const data = doc.data() as any;
          const startDate = toDate(data.startAt); // Timestamp -> Date
          const endDate = toDate(data.endAt);
          const event: Events = {
            id: doc.id,
            business: data.business,
            businessId: data.businessId,
            title: data.title ?? 'Untitled',
            description: data.description ?? '',
            imageUrl: data.imageUrl ?? '',
            startAt: startDate ? formatMMDD_hhmm(startDate) : '',
            endAt: endDate ? formatMMDD_hhmm(endDate) : '',
            isActive: data.isActive,
          };
          items.push(event);
        });

        setEvents(items);
        // keep a stable, alphabetized categories list (with ALL pinned first)
        setLoading(false);
        setRefreshing(false);
      },
      (err) => {
        console.error('onSnapshot error:', err);
        setLoading(false);
        setRefreshing(false);
      },
    );

    unsubRef.current = unsub;
    return () => unsub();
  }, [fetchEvents]);

  const onRefresh = useCallback(() => {
    // We rely on onSnapshot for real-time updates; toggling state will resubscribe.
    setRefreshing(true);
    // Nudge re-subscription without changing category by briefly flipping it.
    setSelectedCategory((prev) => prev);
  }, []);

  const router = useRouter();

  const renderCard = useCallback(({ item }: ListRenderItemInfo<Events>) => {
    return (
      <TouchableOpacity
        onPress={() =>
          router.push({
            pathname: '/events/[id]',
            params: { id: String(item.id) }, // pass only the ID
          })
        }>
        <View className="px-4 py-2">
          <EventCard
            company={item.business}
            photoUrl={item.imageUrl ?? ''}
            eventName={item.title}
            startTime={item.startAt ?? ''}
            endTime={item.endAt ?? ''}
          />
        </View>
      </TouchableOpacity>
    );
  }, []);

  const keyExtractor = useCallback(
    (item: Events, index: number) => item.id || '',
    [],
  );

  const headerBar = useMemo(
    () => (
      <View className="bg-white pb-2 pt-16">
        <FlatList
          data={CATEGORIES}
          horizontal
          keyExtractor={(c) => c}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16 }}
          ItemSeparatorComponent={() => <View className="w-2" />}
          renderItem={({ item: cat }) => (
            <TouchableOpacity
              onPress={() => setSelectedCategory(cat)}
              accessibilityRole="button"
              accessibilityState={{ selected: selectedCategory === cat }}
              className={[
                'rounded-full border px-4 py-2',
                selectedCategory === cat
                  ? 'border-[#00638D] bg-[#00638D]'
                  : 'border-neutral-200 bg-white',
              ].join(' ')}>
              <Text
                className={
                  selectedCategory === cat
                    ? 'font-semibold text-white'
                    : 'text-neutral-800'
                }>
                {cat}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>
    ),
    [selectedCategory],
  );

  return (
    <View className="flex-1 bg-white">
      {/* Filter bar */}
      {headerBar}

      {/* Content list */}
      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator />
        </View>
      ) : (
        <FlatList
          data={events}
          keyExtractor={keyExtractor}
          renderItem={renderCard}
          contentContainerStyle={{ paddingBottom: 40 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}
