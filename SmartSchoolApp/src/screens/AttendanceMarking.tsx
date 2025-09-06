// SmartSchoolApp/src/screens/AttendanceMarking.tsx
import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { globalStyles } from '../theme/globalStyles';
import { fetchStudents, postAttendance } from '../services/api';
import { Student, AttendanceStatus } from '../utils/types';
import { AuthContext } from '../context/AuthContext';
import Button from '../components/Button';

type Props = NativeStackScreenProps<RootStackParamList, 'AttendanceMarking'>;

export default function AttendanceMarking({ route, navigation }: Props) {
  const { classId, className } = route.params || {};
  const { teacher } = useContext(AuthContext);

  const [students, setStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<Record<number, AttendanceStatus>>({});
  const [loading, setLoading] = useState(true);

  // 🎨 Define colors per status
  const statusColors: Record<AttendanceStatus, string> = {
    present: '#4CAF50', // green
    absent: '#F28B82',  // light red
    late: '#FDD663',    // amber
    leave: '#A7C7E7',   // light blue
  };

  useEffect(() => {
    const loadStudents = async () => {
      try {
        const res = await fetchStudents();
        const classStudents = res.data.filter(
          (s: Student) => s.schoolClass && s.schoolClass.id === classId
        );
        setStudents(classStudents);

        // Default everyone to "present"
        const initial: Record<number, AttendanceStatus> = {};
        classStudents.forEach((s) => (initial[s.id] = 'present'));
        setAttendance(initial);
      } catch (err) {
        console.error(err);
        Alert.alert('Error', 'Failed to load students.');
      } finally {
        setLoading(false);
      }
    };
    loadStudents();
  }, [classId]);

  const toggleStatus = (studentId: number, status: AttendanceStatus) => {
    setAttendance((prev) => ({ ...prev, [studentId]: status }));
  };

  const handleSubmit = async () => {
    try {
      for (const student of students) {
        await postAttendance({
          studentId: student.id,
          schoolClassId: classId,
          teacherId: teacher?.id,
          status: attendance[student.id],
        });
      }
      Alert.alert('✅ Success', 'Attendance saved successfully!');
      navigation.goBack();
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to save attendance.');
    }
  };

  const statusOptions: AttendanceStatus[] = ['present', 'absent', 'late', 'leave'];

  if (loading) {
    return (
      <View style={globalStyles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={globalStyles.container}>
      <Text style={[globalStyles.textPrimary, { fontSize: 20, marginBottom: 16 }]}>
        Mark Attendance for {className}
      </Text>

      {students.length === 0 ? (
        <Text style={globalStyles.textSecondary}>No students in this class.</Text>
      ) : (
        <FlatList
          data={students}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={globalStyles.card}>
              <Text style={globalStyles.textPrimary}>
                {item.firstName} {item.lastName} ({item.admissionNumber})
              </Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 8 }}>
                {statusOptions.map((status) => {
                  const isSelected = attendance[item.id] === status;
                  return (
                    <TouchableOpacity
                      key={status}
                      onPress={() => toggleStatus(item.id, status)}
                      style={{
                        paddingVertical: 6,
                        paddingHorizontal: 10,
                        borderRadius: 8,
                        marginRight: 6,
                        marginBottom: 6,
                        backgroundColor: isSelected ? statusColors[status] : '#eee',
                      }}
                    >
                      <Text
                        style={{
                          color: isSelected ? '#fff' : '#333',
                          fontWeight: isSelected ? 'bold' : 'normal',
                          textTransform: 'capitalize',
                        }}
                      >
                        {status}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}
        />
      )}

      {students.length > 0 && (
        <Button title="✅ Save Attendance" onPress={handleSubmit} style={{ marginTop: 16 }} />
      )}
    </View>
  );
}
