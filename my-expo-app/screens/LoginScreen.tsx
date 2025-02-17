import React, { useState } from 'react';
import { View, Text, Button, TextInput, TouchableOpacity } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import WebView from 'react-native-webview';
import { loginUser } from 'utils/api/userApi';

type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Signup: undefined;
};

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

interface Props {
  navigation: LoginScreenNavigationProp;
}

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  async function onLogin() {
    setIsLoading(true);
    setError('');

    try {
      const user = await loginUser(email, password);
      console.log(user);
      navigation.replace('Home');
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <View className="flex-1 items-center justify-center bg-gray-200 p-6">
      <View className="mb-6 h-16 w-16">
        <WebView
          source={require('./../assets/images/bitcoinGif.gif')}
          style={{ width: '100%', height: '100%' }}
        />
      </View>

      <Text className="mb-6 text-2xl font-bold text-gray-900">Login</Text>

      <TextInput
        className="mb-4 w-full rounded-lg border border-gray-300 bg-white p-4"
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <TextInput
        className="mb-5 w-full rounded-lg border border-gray-300 bg-white p-4"
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {error && <Text className="mb-4 font-medium text-red-500">{error}</Text>}

      <TouchableOpacity
        className={`mb-4 w-full rounded-lg bg-green-600 p-4`}
        disabled={isLoading}
        onPress={onLogin}>
        <Text className="text-center font-semibold text-white">
          {isLoading ? 'Loading...' : 'Login'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
        <Text className="font-medium text-blue-700">Don't have an account? Sign up</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;
