import React, { useContext, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';

type Props = NativeStackScreenProps<RootStackParamList, 'AuthLoading'>;

export default function AuthLoading({ navigation }: Props) {
  const { token, loading } = useContext(AuthContext);

  useEffect(() => {
    if (!loading) {
      if (token) {
        navigation.replace('Tabs'); // ✅ already logged in
      } else {
        navigation.replace('Login'); // ❌ not logged in
      }
    }
  }, [loading, token]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#2563EB" />
    </View>
  );
}
