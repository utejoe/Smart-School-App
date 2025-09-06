// SmartSchoolApp/src/screens/ProfileScreen.tsx
import React, { useContext, useEffect, useState } from 'react';
import { Text, ScrollView, View } from 'react-native';
import { globalStyles } from '../theme/globalStyles';
import Card from '../components/Card';
import Button from '../components/Button';
import { AuthContext } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';

// 👇 type the navigation prop
type ProfileScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Tabs'
>;

export default function ProfileScreen() {
  const { teacher, logout } = useContext(AuthContext);
  const navigation = useNavigation<ProfileScreenNavigationProp>();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [classes, setClasses] = useState('');

  // derive initials
  const getInitials = (fullName: string) =>
    fullName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();

  // Load teacher data into local state
  useEffect(() => {
    if (teacher) {
      const fullName = `${teacher.firstName} ${teacher.lastName}`;
      setName(fullName);
      setEmail(teacher.email || '');
      setSubject(
        teacher.subjects?.map((s: any) => s.name).join(', ') || 'No subjects assigned'
      );
      setClasses(
        teacher.schoolClasses?.map((c: any) => c.name).join(', ') || 'No classes assigned'
      );
    }
  }, [teacher]);

  const handleLogout = async () => {
    await logout();
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  return (
    <ScrollView style={globalStyles.container}>
      {/* Avatar */}
      <View
        style={{
          alignSelf: 'center',
          width: 100,
          height: 100,
          borderRadius: 50,
          backgroundColor: '#3B82F6', // blue placeholder
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 20,
        }}
      >
        <Text style={{ color: 'white', fontSize: 32, fontWeight: 'bold' }}>
          {name ? getInitials(name) : '?'}
        </Text>
      </View>

      {/* Greeting */}
      <Text
        style={[
          globalStyles.textPrimary,
          {
            fontSize: 22,
            fontWeight: 'bold',
            marginBottom: 10,
            textAlign: 'center',
          },
        ]}
      >
        👋 Hello {teacher?.firstName ? teacher.firstName : '...'}
      </Text>

      <Text
        style={[
          globalStyles.textSecondary,
          {
            fontSize: 16,
            marginBottom: 20,
            textAlign: 'center',
          },
        ]}
      >
        Welcome to your profile page
      </Text>

      {/* Profile Info */}
      <Card>
        <Text style={[globalStyles.textSecondary, { marginBottom: 8 }]}>
          Full Name
        </Text>
        <Text style={[globalStyles.textPrimary, { marginBottom: 16 }]}>
          {name}
        </Text>

        <Text style={[globalStyles.textSecondary, { marginBottom: 8 }]}>
          Email
        </Text>
        <Text style={[globalStyles.textPrimary, { marginBottom: 16 }]}>
          {email}
        </Text>

        <Text style={[globalStyles.textSecondary, { marginBottom: 8 }]}>
          Subject(s)
        </Text>
        <Text style={[globalStyles.textPrimary, { marginBottom: 16 }]}>
          {subject}
        </Text>

        <Text style={[globalStyles.textSecondary, { marginBottom: 8 }]}>
          Class(es)
        </Text>
        <Text style={[globalStyles.textPrimary]}>
          {classes}
        </Text>
      </Card>

      {/* Actions */}
      <Button
        title="Logout"
        onPress={handleLogout}
        style={{ marginTop: 20, backgroundColor: '#EF4444' }}
      />
    </ScrollView>
  );
}
