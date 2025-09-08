import React from 'react';
import { Text, View } from 'react-native';
import EventCard from '@components/ui/eventsCard';

export default function EventsScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <EventCard
      company = "Brian's Bakery"
      photoUri='assets\bluetest.jpg'
      eventName = "Brian's Bakefest"
      startTime = "9/10 10:00 AM"
      endTime = "9/29 10:00 PM"
      />
    </View>
  );
}
