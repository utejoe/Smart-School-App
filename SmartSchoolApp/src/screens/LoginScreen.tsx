import React, { useState, useContext } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { globalStyles } from '../theme/globalStyles';
import Card from '../components/Card';
import Button from '../components/Button';
import InputField from '../components/InputField';
import { RootStackParamList } from '../../App';
import { loginTeacher } from '../services/api';
import { AuthContext } from '../context/AuthContext';

// --- Props for navigation ---
type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    try {
      const res = await loginTeacher({ emailOrUsername: email, password });
      console.log('✅ Login success:', res.data);

      if (res.data.teacher && res.data.token) {
        await login(res.data.teacher, res.data.token);
        navigation.replace('Tabs');
      } else {
        Alert.alert('Login Failed', 'Invalid server response.');
      }
    } catch (err: any) {
      console.error(err);
      Alert.alert('Login Failed', err.response?.data?.error || 'Something went wrong');
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          style={globalStyles.container}
          contentContainerStyle={{ paddingBottom: 20 }}
          keyboardShouldPersistTaps="handled"
        >
          <Text
            style={[
              globalStyles.textPrimary,
              {
                fontSize: 24,
                fontWeight: 'bold',
                textAlign: 'center',
                marginBottom: 24,
              },
            ]}
          >
            Smart School Login
          </Text>

          <Card>
            <Text style={[globalStyles.textSecondary, { marginBottom: 8 }]}>
              Email / Username
            </Text>
            <InputField
              placeholder="Enter email or username"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />

            <Text style={[globalStyles.textSecondary, { marginBottom: 8 }]}>
              Password
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <InputField
                placeholder="Enter password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                style={{ flex: 1 }}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={{ marginLeft: -40 }}
              >
                <Ionicons
                  name={showPassword ? 'eye' : 'eye-off'}
                  size={22}
                  color="#6B7280"
                />
              </TouchableOpacity>
            </View>

            <Button title="Login" onPress={handleLogin} style={{ marginTop: 16 }} />
          </Card>

          {/* Register link */}
          <TouchableOpacity
            onPress={() => navigation.navigate('Register')}
            style={{ marginTop: 16 }}
          >
            <Text
              style={{
                textAlign: 'center',
                color: '#2563EB',
                fontWeight: '500',
                fontSize: 14,
              }}
            >
              New Teacher? Register here
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
