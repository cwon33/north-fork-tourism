import BusinessCard from '@components/ui/businessCard';
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

import { Business } from '@components/types';

const CATEGORIES = [
  'All',
  'Beverage',
  'Restaurant',
  'Lodging',
  'Service',
  'Farm',
];

export default function DiscoverScreen() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const unsubRef = useRef<(() => void) | null>(null);

  // derive a Firestore query based on selected category
  const fetchBusinesses = useCallback(() => {
    const col = collection(db, 'businesses');
    if (selectedCategory === 'All') {
      return query(col, orderBy('name'));
    }
    return query(
      col,
      where('category', '==', selectedCategory),
      orderBy('name'),
    );
  }, [selectedCategory]);

  // subscribe to Firestore in real-time
  useEffect(() => {
    setLoading(true);
    // clean up previous subscription
    unsubRef.current?.();

    const q = fetchBusinesses();
    const unsub = onSnapshot(
      q,
      (snap) => {
        const items: Business[] = [];
        snap.forEach((doc) => {
          const data = doc.data() as any;
          const b: Business = {
            id: doc.id,
            name: data.name ?? 'Untitled',
            description: data.description ?? '',
            iconUrl: data.iconUrl ?? '',
            isActive: data.isActive ?? false,
          };
          items.push(b);
        });

        setBusinesses(items);
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
  }, [fetchBusinesses]);

  const onRefresh = useCallback(() => {
    // We rely on onSnapshot for real-time updates; toggling state will resubscribe.
    setRefreshing(true);
    // Nudge re-subscription without changing category by briefly flipping it.
    setSelectedCategory((prev) => prev);
  }, []);

  const renderCard = useCallback(({ item }: ListRenderItemInfo<Business>) => {
    return (
      <View className="px-4 py-2">
        <BusinessCard
          photoUrl={item.iconUrl ?? ''}
          phoneticName={item.name}
          description={item.description || ''}
        />
      </View>
    );
  }, []);

  const keyExtractor = useCallback(
    (item: Business, index: number) => item.id || '',
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
          data={businesses}
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
