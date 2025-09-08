import PromoCard from '@components/ui/promotionCard';
import React from 'react';
import { Text, View } from 'react-native';

export default function PromoScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
        <PromoCard
          photoUrl = "assets\bluetest.jpg"
          promoName = "15% Off All Blue Items"
          startDate = "06/01/2024"
          endDate = "06/30/2024"
          company = "Blue Company"
        />
    </View>
  );
}
