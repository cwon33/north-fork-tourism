import React from 'react';
import { Text, View } from 'react-native';
import BusinessCard from '@components/ui/businessCard';

export default function DiscoverScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <BusinessCard
      photoUri="@assets/icon.png"
      phoneticName="[Kon-To-Kos-Ta] Winery"
      description="Brief Description Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium."
/>
    </View>
  );
}
