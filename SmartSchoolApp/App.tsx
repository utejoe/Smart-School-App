import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Tabs from './src/navigation/Tabs';
import AttendanceMarking from './src/screens/AttendanceMarking';
import AttendanceDetails from './src/screens/AttendanceDetails'; // 👈 NEW
import StudentDetails from './src/screens/StudentDetails';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import AuthLoading from './src/screens/AuthLoading';

import { AuthProvider } from './src/context/AuthContext';

// --- Types ---
export type RootStackParamList = {
  AuthLoading: undefined;
  Login: undefined;
  Register: undefined;
  Tabs: undefined;
  AttendanceMarking: { classId: number; className: string } | undefined;
  StudentDetails: { studentId: number };
  AttendanceDetails: { classId: number; date: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="AuthLoading" component={AuthLoading} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="Tabs" component={Tabs} />
          <Stack.Screen
            name="AttendanceMarking"
            component={AttendanceMarking}
            options={{ headerShown: true, title: 'Mark Attendance' }}
          />
          <Stack.Screen
            name="StudentDetails"
            component={StudentDetails}
            options={{ headerShown: true, title: 'Student Details' }}
          />
          <Stack.Screen
            name="AttendanceDetails"
            component={AttendanceDetails}
            options={{ headerShown: true, title: 'Attendance Details' }} // ✅ NEW
          />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}
