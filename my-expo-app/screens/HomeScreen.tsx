import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, Button, ActivityIndicator } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { logoutUser } from 'utils/api/userApi';
import { fetchCoins } from 'utils/api/coinApi';

type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Signup: undefined;
};

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

interface Props {
  navigation: HomeScreenNavigationProp;
}

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const [btcRate, setBtcRate] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setLoading(true);
      fetchCoins()
        .then((data) => setBtcRate(data[0]?.rate || 0))
        .catch((err) => console.error('Error fetching Bitcoin rate:', err))
        .finally(() => setLoading(false));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleLogout = useCallback(async () => {
    await logoutUser();
    navigation.replace('Login');
  }, [navigation]);

  return (
    <View className="flex-1 items-center justify-center bg-red-500 px-6 py-8">
      <Text className="mb-3 text-2xl font-bold text-white"> BITCOIN</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#fff" />
      ) : (
        <Text className="mb-5 text-xl font-semibold text-white">
          BTC Rate now: ${btcRate.toFixed(2) ?? 'N/A'}
        </Text>
      )}

      <Button title="Logout" onPress={handleLogout} color="darkred" />
    </View>
  );
};

export default HomeScreen;
