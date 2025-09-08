import React from "react";
import { Image, Linking, ScrollView, TouchableOpacity, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { MapPin, Phone, Mail, Share2 } from "lucide-react-native";
import { Text } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft } from "lucide-react-native";
import { Pressable } from "react-native";
import PromoPill from '@components/ui/promo-pill';


function BackButtonOverlay() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView
      pointerEvents="box-none"
      style={{ position: "absolute", top: 0, left: 0, right: 0 }}
    >
      <Pressable
        onPress={() => router.back()}
        className="m-2 h-10 w-10 items-center justify-center rounded-full bg-black/30"
        style={{ marginTop: insets.top - 60}}
        accessibilityRole="button"
        accessibilityLabel="Go back"
      >
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
    upcomingEvents: Array<{ id: string; title: string; startsAt: string }>;
};

export default function BusinessPage({
    id,
    businessName,
    heroImageUrl,
    promoText,
    description,
    phone,
    mapsLink,
    bizUrl,
    locationLine,
    upcomingEvents,
}: BusinessPage) {
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const openDial = () => Linking.openURL(phone);
    const openMaps = () => Linking.openURL(mapsLink);
    const openShare = () => Linking.openURL(bizUrl);

    return (
    <View className="flex-1 bg-[#00638D]">
      <Image source={require("../../assets/adaptive-icon.png")}  className="h-80 w-full" /> {/* heroImageUrl }} className="h-60 w-full" /> */}  
      <BackButtonOverlay />
      <SafeAreaView style={{ flex: 1, backgroundColor: "white", borderTopLeftRadius: 0, borderTopRightRadius: 0, alignItems: "center", marginTop: -12 }}>
        <ScrollView
          style={{ flex: 1, paddingHorizontal: 16}}
        >
          {/* Title + actions */}
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <Text style={{ fontFamily: 'LibreBaskerville-Bold', fontSize: 18, color: "#00638D" }}>
                Brian's Wine & Spirits
              {/* {businessName} */}
            </Text>
            <View style={{ flexDirection: "row", gap: 16 }}>
              <TouchableOpacity onPress={openDial} accessibilityLabel="Call">
                <Phone size={20} color="#202020" />
              </TouchableOpacity>
              <TouchableOpacity onPress={openMaps} accessibilityLabel="Location">
                <MapPin size={20} color="#202020" />
              </TouchableOpacity>
              <TouchableOpacity onPress={openShare} accessibilityLabel="Share">
                <Share2 size={20} color="#202020" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Promo pill */}
          <View>
            <PromoPill promoName={"15% off all white wine"} /> 
            {/* {promoText ? <PromoPill promoName={promoText} /> : null} */}
          </View>

          {/* Description */}
          <Text style={{ marginTop: 16, color: "#202020", lineHeight: 20, fontFamily: 'Montserrat', fontSize: 16}}>
            Along with our farming practices, our commitment to sustainability is
            furthered by a 9000 square foot winery building that is registered
            with the U.S. Green Building Council under the LEED New Construction
            2009 rating system. The winery’s sustainable elements include: wind
            energy, xeriscape method landscaping and an organic community garden
            that supports local non-profits.
            {/* {description} */}
          </Text>

          {/* Upcoming Events */}
          <Text style={{ marginTop: 20, color: "#00638D", fontFamily: 'Montserrat_Bold', fontSize: 16}}>
            Upcoming Events:
          </Text>
          <Text style={{ marginTop: 6, color: "#202020", fontFamily: 'Montserrat', fontSize: 12}}>
            None right now!
            {/* {upcomingEvents.map(ev => (
                <Text key={ev.id} style={{ color: "#202020", marginBottom: 6 }}>
        •           {ev.title} — {new Date(ev.startsAt).toLocaleString()}
                </Text>
             ))} */}
          </Text>

          {/* Address */}
          <TouchableOpacity
            onPress={openMaps}
            style={{ flexDirection: "row", alignItems: "center", marginTop: 20, gap: 4 }}
          >
            <MapPin size={16} color="#00638D" />
            <Text style={{ color: "#00638D", fontFamily: 'Montserrat', fontSize: 16, textDecorationLine: "underline" }}>
              825 North Rd, Greenport, NY 11944, USA
              {/* {locationLine} */}
            </Text>
          </TouchableOpacity>

          {/* Mini Map placeholder */}
          <View
            style={{
              height: 160,
              backgroundColor: "#e9eef1",
              borderRadius: 12,
              overflow: "hidden",
              marginTop: 12,
            }}
          >
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
