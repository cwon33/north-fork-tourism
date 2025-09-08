import { Image, Text, View } from 'react-native';

type EventCard = {
  photoUrl: string;
  eventName: string;
  startTime: string;
  endTime: string;
  company: string;
};

export default function EventCard({
  photoUrl,
  eventName,
  startTime,
  endTime,
  company,
}: EventCard) {
  return (
    <View
      style={{
        width: 352,
        height: 108,
        borderRadius: 18,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 2,
      }}
      className="flex-row items-center justify-center rounded-2xl bg-white p-3">
      {/* Left image 80x80 with rounded corners */}
      <Image
        src={photoUrl}
        style={{
          width: 80,
          height: 80,
          borderRadius: 16,
          backgroundColor: '#000000ff',
        }}
        resizeMode="cover"
      />

      {/* Right content */}
      <View className="ml-3 flex-1">
        {/* Title: bracketed phonetic + bold category on next line */}
        <Text
          style={{
            fontFamily: 'LibreBaskerville-Bold',
            fontSize: 20,
            color: '#00638D',
          }}
          numberOfLines={2}>
          {eventName}
        </Text>

        {/*Company */}
        <Text style={{ marginTop: 1 }} numberOfLines={4}>
          <Text
            style={{
              fontFamily: 'Montserrat_Bold',
              fontSize: 14,
              color: '#202020',
            }}>
            {company}
          </Text>
        </Text>

        {/*Time */}
        <Text style={{ marginTop: 2 }} numberOfLines={2}>
          <Text
            style={{
              fontFamily: 'Montserrat',
              fontSize: 12,
              color: '#202020',
            }}>
            {startTime}
          </Text>
          <Text
            style={{
              fontFamily: 'Montserrat',
              fontSize: 12,
              color: '#202020',
            }}>
            {' '}
            -{' '}
          </Text>
          <Text
            style={{
              fontFamily: 'Montserrat',
              fontSize: 12,
              color: '#202020',
            }}>
            {endTime}
          </Text>
        </Text>
      </View>
    </View>
  );
}
