import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';

import TeacherDashboard from '../screens/TeacherDashboard';
import ClassesScreen from '../screens/ClassesScreen';
import ProfileScreen from '../screens/ProfileScreen';
import AttendanceScreen from '../screens/AttendanceScreen'; // NEW

const Tab = createBottomTabNavigator();

export default function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName = 'home';

          if (route.name === 'Dashboard') iconName = 'home';
          else if (route.name === 'Classes') iconName = 'book';
          else if (route.name === 'Attendance') iconName = 'checkmark-done';
          else if (route.name === 'Profile') iconName = 'person';

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#1E3A8A',
        tabBarInactiveTintColor: '#6B7280',
        tabBarStyle: { backgroundColor: '#FFFFFF' },
        headerStyle: { backgroundColor: '#1E3A8A' },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: { fontWeight: 'bold' },
      })}
    >
      <Tab.Screen
        name="Dashboard"
        component={TeacherDashboard}
        options={{ title: 'Smart School' }}
      />
      <Tab.Screen
        name="Classes"
        component={ClassesScreen}
        options={{ title: 'Classes' }}
      />
      <Tab.Screen
        name="Attendance"
        component={AttendanceScreen} // now distinct
        options={{ title: 'Attendance' }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: 'Profile' }}
      />
    </Tab.Navigator>
  );
}
