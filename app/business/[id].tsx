import { useLocalSearchParams, useRouter } from 'expo-router';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from 'FirebaseConfig';
import { ChevronLeft, MapPin, Phone, Share2 } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Linking,
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
        onPress={() => router.back()}
        className="m-2 h-10 w-10 items-center justify-center rounded-full bg-black/30"
        style={{ marginTop: insets.top - 60 }}
        accessibilityRole="button"
        accessibilityLabel="Go back">
        <ChevronLeft size={22} color="white" />
      </Pressable>
    </SafeAreaView>
  );
}

type BusinessPage = {
  id: string;
  businessName: string;
  heroImageUrl: string;
  promoText?: string;
  description: string;
  phone: string;
  mapsLink: string;
  bizUrl: string;
  locationLine: string;
  upcomingEvents?: Array<{ id: string; title: string; startsAt: string }>;
};

export default function BusinessPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [biz, setBiz] = useState<BusinessPage | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    const ref = doc(db, 'businesses', String(id));
    const unsub = onSnapshot(
      ref,
      (snap) => {
        const data = snap.data() as any;
        if (data) {
          setBiz({
            id: snap.id,
            businessName: data.name ?? 'Untitled',
            description: data.description ?? '',
            heroImageUrl: data.iconUrl ?? '',
            promoText: data.description ?? '',
            phone: data.contact.phone ?? '',
            mapsLink: data.contact.mapsUrl ?? '',
            bizUrl: data.contact.website ?? '',
            locationLine: data.address.street ?? '',
          });
        } else {
          setBiz(null);
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
  if (!biz) {
    return (
      <View className="flex-1 items-center justify-center bg-white p-6">
        <Text className="text-base text-neutral-800">Business not found.</Text>
      </View>
    );
  }

  const openDial = () =>
    biz.phone &&
    Linking.openURL(
      biz.phone.startsWith('tel:') ? biz.phone : `tel:${biz.phone}`,
    );
  const openMaps = () => biz.mapsLink && Linking.openURL(biz.mapsLink);
  const openShare = () => biz.bizUrl && Linking.openURL(biz.bizUrl);

  return (
    <View className="flex-1 bg-[#00638D]">
      <Image
        src={biz.heroImageUrl}
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
              {biz.businessName}
            </Text>
            <View style={{ flexDirection: 'row', gap: 16 }}>
              {!!biz.phone && (
                <TouchableOpacity onPress={openDial} accessibilityLabel="Call">
                  <Phone size={20} color="#202020" />
                </TouchableOpacity>
              )}
              {!!biz.mapsLink && (
                <TouchableOpacity
                  onPress={openMaps}
                  accessibilityLabel="Location">
                  <MapPin size={20} color="#202020" />
                </TouchableOpacity>
              )}
              {!!biz.bizUrl && (
                <TouchableOpacity
                  onPress={openShare}
                  accessibilityLabel="Website">
                  <Share2 size={20} color="#202020" />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Description */}
          {!!biz.description && (
            <Text
              style={{
                marginTop: 16,
                color: '#202020',
                lineHeight: 20,
                fontFamily: 'Montserrat',
                fontSize: 16,
              }}>
              {biz.description}
            </Text>
          )}

          {/* Address */}
          {!!biz.locationLine && (
            <TouchableOpacity
              onPress={openMaps}
              className="mt-5 flex-row items-center gap-1.5">
              <MapPin size={16} color="#00638D" />
              <Text
                className="text-base text-[#00638D]"
                style={{
                  fontFamily: 'Montserrat',
                  textDecorationLine: 'underline',
                }}>
                {biz.locationLine}
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
