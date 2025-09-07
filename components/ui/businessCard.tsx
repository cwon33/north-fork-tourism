import { Image, Text, View } from 'react-native';

type BusinessCard = {
  photoUri: string;
  phoneticName: string;
  description: string;
};

export default function BusinessCard({
  photoUri,
  phoneticName,
  description,
}: BusinessCard) {
  return (
    <View
      style={{ width: 352, height: 108, borderRadius: 18, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 8, elevation: 2 }}
      className="bg-white rounded-2xl flex-row items-center justify-center p-3"
    >
      {/* Left image 80x80 with rounded corners */}
      <Image
        source={require('@assets/bluetest.jpg')}//{ uri: photoUri }}
        style={{ width: 80, height: 80, borderRadius: 16, backgroundColor: '#000000ff' }}
        resizeMode="cover"
      />

      {/* Right content */}
      <View className="ml-3 flex-1">
        {/* Title: bracketed phonetic + bold category on next line */}
        <Text
        style={{ fontFamily: 'LibreBaskerville-Bold', fontSize: 16, color: '#00638D' }}
        numberOfLines={2}
        >
          {phoneticName}
        </Text>

        {/* Description (2 lines) */}
        <Text
        style={{ fontFamily: 'Montserrat', fontSize: 12, color: '#202020' }}
        numberOfLines={2}
        >
          {description}
        </Text>
      </View>
    </View>
  );
}

