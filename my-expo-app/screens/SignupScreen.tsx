import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { signupUser } from 'utils/api/userApi';

type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Signup: undefined;
};

type SignupScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Signup'>;

interface Props {
  navigation: SignupScreenNavigationProp;
}

const SignupScreen: React.FC<Props> = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  async function onSignup() {
    if (password !== repeatPassword) {
      setError('Passwords do not match!');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const user = await signupUser(username, email, password);
      console.log(user);
      navigation.replace('Login');
    } catch (err) {
      setError('Signup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <View className="flex-1 items-center justify-center bg-gray-200 p-6">
      <Text className="mb-6 text-2xl font-bold text-gray-900">Create an Account</Text>

      <TextInput
        className="mb-4 w-full rounded-lg border border-gray-300 bg-white p-4"
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />

      <TextInput
        className="mb-4 w-full rounded-lg border border-gray-300 bg-white p-4"
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <TextInput
        className="mb-4 w-full rounded-lg border border-gray-300 bg-white p-4"
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TextInput
        className="mb-5 w-full rounded-lg border border-gray-300 bg-white p-4"
        placeholder="Confirm Password"
        value={repeatPassword}
        onChangeText={setRepeatPassword}
        secureTextEntry
      />

      {error && <Text className="mb-4 font-medium text-red-500">{error}</Text>}

      <TouchableOpacity
        className="mb-4 w-full rounded-lg bg-green-600 p-4"
        disabled={isLoading}
        onPress={onSignup}>
        <Text className="text-center font-semibold text-white">
          {isLoading ? 'Signing up...' : 'Sign Up'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text className="font-medium text-blue-700">Already have an account? Log in</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SignupScreen;
