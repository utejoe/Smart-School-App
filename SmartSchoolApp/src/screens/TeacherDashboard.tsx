// SmartSchoolApp/src/screens/TeacherDashboard.tsx
import React, { useContext, useEffect, useState } from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { globalStyles } from '../theme/globalStyles';
import Card from '../components/Card';
import Button from '../components/Button';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';

type TeacherDashboardNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'AttendanceMarking'
>;

type SchoolClass = { id: number; name: string };
type Subject = { id: number; name: string };

export default function TeacherDashboard() {
  const navigation = useNavigation<TeacherDashboardNavigationProp>();
  const { teacher } = useContext(AuthContext);

  const [selectedClass, setSelectedClass] = useState<number | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<number | null>(null);

  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);

  // Load teacher’s assigned classes and subjects from AuthContext
  useEffect(() => {
    if (teacher) {
      setClasses(teacher.schoolClasses || []);
      setSubjects(teacher.subjects || []);
    }
  }, [teacher]);

  const handleGoToAttendance = () => {
    if (!selectedClass) {
      Alert.alert('Error', 'Please select a class first.');
      return;
    }

    navigation.navigate('AttendanceMarking', {
      classId: selectedClass,
      className: classes.find((c) => c.id === selectedClass)?.name || '',
      subjectId: selectedSubject ?? undefined,
      subjectName: subjects.find((s) => s.id === selectedSubject)?.name,
      mode: 'new',
    });
  };

  return (
    <ScrollView style={globalStyles.container}>
      {/* Greeting */}
      <Text style={[globalStyles.textPrimary, { fontSize: 20, marginBottom: 20 }]}>
        Welcome, {teacher?.firstName ?? 'Teacher'} 👩‍🏫
      </Text>

      {/* Select Class */}
      <Card>
        <Text style={globalStyles.textSecondary}>Select Class</Text>
        <Picker
          selectedValue={selectedClass}
          onValueChange={(value: number | null) => setSelectedClass(value)}
        >
          <Picker.Item label="-- Choose Class --" value={null} />
          {classes.map((cls) => (
            <Picker.Item key={cls.id} label={cls.name} value={cls.id} />
          ))}
        </Picker>
      </Card>

      {/* Select Subject */}
      <Card>
        <Text style={globalStyles.textSecondary}>Select Subject</Text>
        <Picker
          selectedValue={selectedSubject}
          onValueChange={(value: number | null) => setSelectedSubject(value)}
        >
          <Picker.Item label="-- Choose Subject --" value={null} />
          {subjects.map((sub) => (
            <Picker.Item key={sub.id} label={sub.name} value={sub.id} />
          ))}
        </Picker>
      </Card>

      {/* Action */}
      <Button
        title="Go to Attendance"
        onPress={handleGoToAttendance}
        style={{ marginTop: 20 }}
      />
    </ScrollView>
  );
}
