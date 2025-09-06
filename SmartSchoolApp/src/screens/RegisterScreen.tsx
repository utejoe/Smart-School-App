import React, { useState, useEffect } from 'react';
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
  Modal,
  FlatList,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { globalStyles } from '../theme/globalStyles';
import Card from '../components/Card';
import Button from '../components/Button';
import InputField from '../components/InputField';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { registerTeacher, fetchClasses, api } from '../services/api';

type Props = NativeStackScreenProps<RootStackParamList, 'Register'>;

export default function RegisterScreen({ navigation }: Props) {
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [subjects, setSubjects] = useState<{ id: number; name: string }[]>([]);
  const [classes, setClasses] = useState<{ id: number; name: string }[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<{ id: number; name: string } | null>(null);
  const [selectedClass, setSelectedClass] = useState<{ id: number; name: string } | null>(null);

  const [subjectModalVisible, setSubjectModalVisible] = useState(false);
  const [classModalVisible, setClassModalVisible] = useState(false);
  const [subjectSearch, setSubjectSearch] = useState('');
  const [classSearch, setClassSearch] = useState('');
  const [loadingSubjects, setLoadingSubjects] = useState(false);
  const [loadingClasses, setLoadingClasses] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoadingSubjects(true);
        setLoadingClasses(true);

        // Fetch subjects from backend
        const subjectsRes = await api.get('/subjects');
        setSubjects(subjectsRes.data);

        // Fetch classes from backend
        const classesRes = await fetchClasses();
        setClasses(classesRes.data);
      } catch (err) {
        console.error('Error fetching subjects/classes', err);
        Alert.alert('Error', 'Could not load subjects or classes');
      } finally {
        setLoadingSubjects(false);
        setLoadingClasses(false);
      }
    };

    loadData();
  }, []);

  const filteredSubjects = subjects.filter((s) =>
    s.name.toLowerCase().includes(subjectSearch.toLowerCase())
  );

  const filteredClasses = classes.filter((c) =>
    c.name.toLowerCase().includes(classSearch.toLowerCase())
  );

  const handleRegister = async () => {
    if (!username || !firstName || !lastName || !email || !password || !selectedSubject || !selectedClass) {
      Alert.alert('Error', 'All fields are required');
      return;
    }

    try {
      await registerTeacher({
        username,
        firstName,
        lastName,
        email,
        password,
        subjects: [selectedSubject.name],
        schoolClasses: [selectedClass.name],
      });

      Alert.alert('Success', 'Registration complete. Please login.');
      navigation.replace('Login');
    } catch (err: any) {
      Alert.alert('Registration Failed', err.response?.data?.error || 'Something went wrong');
    }
  };

  const renderItem = (item: { id: number; name: string }, onSelect: any) => (
    <TouchableOpacity
      style={{ padding: 12, borderBottomWidth: 1, borderColor: '#eee' }}
      onPress={() => onSelect(item)}
    >
      <Text>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          style={globalStyles.container}
          contentContainerStyle={{ paddingBottom: 20 }}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={[globalStyles.textPrimary, { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 24 }]}>
            Teacher Registration
          </Text>

          <Card>
            <Text style={[globalStyles.textSecondary, { marginBottom: 8 }]}>Username</Text>
            <InputField placeholder="Enter username" value={username} onChangeText={setUsername} />

            <Text style={[globalStyles.textSecondary, { marginBottom: 8 }]}>First Name</Text>
            <InputField placeholder="Enter first name" value={firstName} onChangeText={setFirstName} />

            <Text style={[globalStyles.textSecondary, { marginBottom: 8 }]}>Last Name</Text>
            <InputField placeholder="Enter last name" value={lastName} onChangeText={setLastName} />

            <Text style={[globalStyles.textSecondary, { marginBottom: 8 }]}>Email</Text>
            <InputField placeholder="Enter email" value={email} onChangeText={setEmail} keyboardType="email-address" />

            <Text style={[globalStyles.textSecondary, { marginBottom: 8 }]}>Password</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <InputField
                placeholder="Enter password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                style={{ flex: 1 }}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={{ marginLeft: -40 }}>
                <Ionicons name={showPassword ? 'eye' : 'eye-off'} size={22} color="#6B7280" />
              </TouchableOpacity>
            </View>

            {/* Subject Selection */}
            <Text style={[globalStyles.textSecondary, { marginBottom: 8 }]}>Subject</Text>
            {loadingSubjects ? (
              <ActivityIndicator size="small" color="#000" style={{ marginBottom: 16 }} />
            ) : (
              <TouchableOpacity
                style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 12, marginBottom: 16 }}
                onPress={() => setSubjectModalVisible(true)}
              >
                <Text>{selectedSubject ? selectedSubject.name : '-- Select Subject --'}</Text>
              </TouchableOpacity>
            )}

            {/* Class Selection */}
            <Text style={[globalStyles.textSecondary, { marginBottom: 8 }]}>Class</Text>
            {loadingClasses ? (
              <ActivityIndicator size="small" color="#000" style={{ marginBottom: 16 }} />
            ) : (
              <TouchableOpacity
                style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 12, marginBottom: 16 }}
                onPress={() => setClassModalVisible(true)}
              >
                <Text>{selectedClass ? selectedClass.name : '-- Select Class --'}</Text>
              </TouchableOpacity>
            )}

            <Button title="Register" onPress={handleRegister} style={{ marginTop: 16 }} />
          </Card>

          {/* Subject Modal */}
          <Modal
            visible={subjectModalVisible}
            transparent
            animationType="slide"
            onRequestClose={() => setSubjectModalVisible(false)}
          >
            <TouchableWithoutFeedback onPress={() => setSubjectModalVisible(false)}>
              <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center' }}>
                <TouchableWithoutFeedback>
                  <View style={{ backgroundColor: 'white', margin: 20, borderRadius: 8, maxHeight: '50%' }}>
                    <TextInput
                      placeholder="Search Subject..."
                      value={subjectSearch}
                      onChangeText={setSubjectSearch}
                      style={{ padding: 12, borderBottomWidth: 1, borderColor: '#eee' }}
                    />
                    <FlatList
                      data={filteredSubjects}
                      keyExtractor={(item) => item.id.toString()}
                      renderItem={({ item }) => renderItem(item, (i: any) => {
                        setSelectedSubject(i);
                        setSubjectModalVisible(false);
                        setSubjectSearch('');
                      })}
                      keyboardShouldPersistTaps="handled"
                    />
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </TouchableWithoutFeedback>
          </Modal>

          {/* Class Modal */}
          <Modal
            visible={classModalVisible}
            transparent
            animationType="slide"
            onRequestClose={() => setClassModalVisible(false)}
          >
            <TouchableWithoutFeedback onPress={() => setClassModalVisible(false)}>
              <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center' }}>
                <TouchableWithoutFeedback>
                  <View style={{ backgroundColor: 'white', margin: 20, borderRadius: 8, maxHeight: '40%' }}>
                    <TextInput
                      placeholder="Search Class..."
                      value={classSearch}
                      onChangeText={setClassSearch}
                      style={{ padding: 12, borderBottomWidth: 1, borderColor: '#eee' }}
                    />
                    <FlatList
                      data={filteredClasses}
                      keyExtractor={(item) => item.id.toString()}
                      renderItem={({ item }) => renderItem(item, (i: any) => {
                        setSelectedClass(i);
                        setClassModalVisible(false);
                        setClassSearch('');
                      })}
                      keyboardShouldPersistTaps="handled"
                    />
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
