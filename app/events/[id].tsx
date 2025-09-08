import { useLocalSearchParams, useRouter } from 'expo-router';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from 'FirebaseConfig';
import { ChevronLeft, MapPin } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

function BackButtonOverlay() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView
      pointerEvents="box-none"
      style={{ position: 'absolute', top: 0, left: 0, right: 0 }}>
      <Pressable
        onPress={() => router.push({ pathname: '/(tabs)/events' })}
        className="m-2 h-10 w-10 items-center justify-center rounded-full bg-black/30"
        style={{ marginTop: insets.top - 60 }}
        accessibilityRole="button"
        accessibilityLabel="Go back">
        <ChevronLeft size={22} color="white" />
      </Pressable>
    </SafeAreaView>
  );
}

type EventPage = {
  id: string;
  businessName: string;
  heroImageUrl: string;
  promoText?: string;
  description: string;
  locationLine: string;
};

export default function BusinessPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [event, setEvent] = useState<EventPage | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    const ref = doc(db, 'events', String(id));
    const unsub = onSnapshot(
      ref,
      (snap) => {
        const data = snap.data() as any;
        if (data) {
          setEvent({
            id: snap.id,
            businessName: data.business ?? 'Untitled',
            description: data.description ?? '',
            heroImageUrl: data.imageUrl ?? '',
            promoText: data.description ?? '',
            locationLine: data.address.street ?? '',
          });
        } else {
          setEvent(null);
        }
        setLoading(false);
      },
      (err) => {
        console.error('details onSnapshot error:', err);
        setLoading(false);
      },
    );
    return () => unsub();
  }, [id]);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator />
      </View>
    );
  }
  if (!event) {
    return (
      <View className="flex-1 items-center justify-center bg-white p-6">
        <Text className="text-base text-neutral-800">Business not found.</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#00638D]">
      <Image
        src={event.heroImageUrl}
        className="h-60 w-full"
        resizeMode="cover"
      />

      <BackButtonOverlay />

      <SafeAreaView
        className="flex-1 bg-white"
        style={{
          marginTop: -12,
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
        }}>
        <ScrollView
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}>
          {/* Title + actions */}
          <View className="mt-4 flex-row items-center justify-between">
            <Text
              style={{
                fontFamily: 'LibreBaskerville-Bold',
                fontSize: 18,
                color: '#00638D',
              }}>
              {event.businessName}
            </Text>
          </View>

          {/* Description */}
          {!!event.description && (
            <Text
              style={{
                marginTop: 16,
                color: '#202020',
                lineHeight: 20,
                fontFamily: 'Montserrat',
                fontSize: 16,
              }}>
              {event.description}
            </Text>
          )}

          {/* Address */}
          {!!event.locationLine && (
            <TouchableOpacity
              onPress={() => {}}
              className="mt-5 flex-row items-center gap-1.5">
              <MapPin size={16} color="#00638D" />
              <Text
                className="text-base text-[#00638D]"
                style={{
                  fontFamily: 'Montserrat',
                  textDecorationLine: 'underline',
                }}>
                {event.locationLine}
              </Text>
            </TouchableOpacity>
          )}

          {/* Mini map placeholder (replace with MapView later) */}
          <View className="mt-3 h-40 rounded-xl bg-[#e9eef1]" />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
