import PromoCard from '@components/ui/promotionCard';
import { useRouter } from 'expo-router';
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

import { formatMMDD_hhmm, toDate } from '@components/dateFormatter';

import { Promotions } from '@components/types';

const CATEGORIES = [
  'All',
  'Beverage',
  'Restaurant',
  'Lodging',
  'Service',
  'Farm',
];

export default function PromoScreen() {
  const [promo, setPromos] = useState<Promotions[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const unsubRef = useRef<(() => void) | null>(null);

  // derive a Firestore query based on selected category
  const fetchPromotions = useCallback(() => {
    const col = collection(db, 'promotions');
    if (selectedCategory === 'All') {
      return query(col, orderBy('title'));
    }
    return query(
      col,
      where('category', '==', selectedCategory),
      orderBy('title'),
    );
  }, [selectedCategory]);

  // subscribe to Firestore in real-time
  useEffect(() => {
    setLoading(true);
    // clean up previous subscription
    unsubRef.current?.();

    const q = fetchPromotions();
    const unsub = onSnapshot(
      q,
      (snap) => {
        const items: Promotions[] = [];
        snap.forEach((doc) => {
          const data = doc.data() as any;
          const startDate = toDate(data.validFrom); // Timestamp -> Date
          const endDate = toDate(data.validTo);
          const b: Promotions = {
            id: doc.id,
            title: data.title ?? 'Untitled',
            imageUrl: data.imageUrl,
            business: data.business ?? '',
            businessId: data.businessId,
            validFrom: startDate ? formatMMDD_hhmm(startDate) : '',
            validTo: endDate ? formatMMDD_hhmm(endDate) : '',
            isActive: data.isActive ?? false,
          };
          items.push(b);
        });

        setPromos(items);
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
  }, [fetchPromotions]);

  const onRefresh = useCallback(() => {
    // We rely on onSnapshot for real-time updates; toggling state will resubscribe.
    setRefreshing(true);
    // Nudge re-subscription without changing category by briefly flipping it.
    setSelectedCategory((prev) => prev);
  }, []);

  const router = useRouter();

  const renderCard = useCallback(
    ({ item }: ListRenderItemInfo<Promotions>) => {
      return (
        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: '/business/[id]',
              params: { id: String(item.businessId) }, // pass only the ID
            })
          }>
          <View className="px-4 py-2">
            <PromoCard
              photoUrl={item.imageUrl ?? ''}
              promoName={item.title}
              startDate={item.validFrom ?? ''}
              endDate={item.validTo ?? ''}
              company={item.business}
            />
          </View>
        </TouchableOpacity>
      );
    },
    [router],
  );

  const keyExtractor = useCallback(
    (item: Promotions, index: number) => item.id || '',
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
          data={promo}
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
