import { Text, View } from 'react-native';

type PromoPill = {
  promoName: string;
};

export default function PromoPill({ promoName }: PromoPill) {
  return (
    <View
      style={{
        alignSelf: 'flex-start',
        marginTop: 12,
        backgroundColor: '#00638D',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 16,
      }}>
      <Text
        style={{ color: '#ffffffff', fontFamily: 'Montserrat', fontSize: 12 }}>
        {promoName}
      </Text>
    </View>
  );
}
