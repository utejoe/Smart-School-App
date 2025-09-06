// SmartSchoolApp/src/screens/AttendanceDetails.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../../App';
import { globalStyles } from '../theme/globalStyles';
import Button from '../components/Button';
import { fetchAttendanceSession, updateAttendance } from '../services/api';
import { AttendanceStatus } from '../utils/types';

type AttendanceDetailsRouteProp = RouteProp<RootStackParamList, 'AttendanceDetails'>;

export default function AttendanceDetails() {
  const route = useRoute<AttendanceDetailsRouteProp>();
  const { classId, date } = route.params;

  console.log('[DEBUG] route.params:', route.params);

  const [students, setStudents] = useState<any[]>([]);
  const [attendance, setAttendance] = useState<Record<number, AttendanceStatus>>({});
  const [className, setClassName] = useState('');
  const [sessionDate, setSessionDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);

  const statusColors: Record<AttendanceStatus, string> = {
    present: '#4CAF50',
    absent: '#F28B82',
    late: '#FDD663',
    leave: '#A7C7E7',
  };

  useEffect(() => {
    const loadDetails = async () => {
      console.log('[DEBUG] Loading attendance for classId:', classId, 'date:', date);
      try {
        const res = await fetchAttendanceSession(classId, date); 
        console.log('[DEBUG] fetchAttendanceSession response:', res);

        const data = res.data;
        console.log('[DEBUG] attendance data:', data);

        setClassName(data.schoolClass?.name || '');
        setSessionDate(new Date(data.date).toLocaleString());
        setStudents(data.students || []);

        const initial: Record<number, AttendanceStatus> = {};
        (data.students || []).forEach((s: any) => {
          initial[s.id] = s.status as AttendanceStatus;
        });
        setAttendance(initial);

        console.log('[DEBUG] initial attendance state:', initial);
      } catch (err) {
        console.error('[ERROR] Failed to load attendance details:', err);
        Alert.alert('Error', 'Failed to load attendance details.');
      } finally {
        setLoading(false);
        console.log('[DEBUG] Loading finished');
      }
    };

    loadDetails();
  }, [classId, date]);

  const toggleStatus = (studentId: number, status: AttendanceStatus) => {
    console.log('[DEBUG] Toggling status for studentId:', studentId, 'to:', status);
    if (!editMode) return;
    setAttendance((prev) => ({ ...prev, [studentId]: status }));
  };

  const handleSave = async () => {
    console.log('[DEBUG] Saving attendance...', attendance);
    try {
      for (const studentId of Object.keys(attendance)) {
        console.log('[DEBUG] Updating studentId:', studentId, 'with status:', attendance[Number(studentId)]);
        await updateAttendance(Number(studentId), { status: attendance[Number(studentId)] });
      }
      Alert.alert('✅ Success', 'Attendance updated!');
      setEditMode(false);
    } catch (err) {
      console.error('[ERROR] Failed to update attendance:', err);
      Alert.alert('Error', 'Failed to update attendance.');
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
        Attendance Details for {className}
      </Text>
      <Text style={globalStyles.textSecondary}>Date: {sessionDate}</Text>

      {students.length === 0 ? (
        <Text style={globalStyles.textSecondary}>No records available.</Text>
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
                      disabled={!editMode}
                      onPress={() => toggleStatus(item.id, status)}
                      style={{
                        paddingVertical: 6,
                        paddingHorizontal: 10,
                        borderRadius: 8,
                        marginRight: 6,
                        marginBottom: 6,
                        backgroundColor: isSelected ? statusColors[status] : '#eee',
                        opacity: editMode ? 1 : 0.5,
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

      <View style={{ marginTop: 16, flexDirection: 'row' }}>
        {!editMode ? (
          <Button title="✏️ Edit" onPress={() => setEditMode(true)} style={{ flex: 1 }} />
        ) : (
          <>
            <Button title="💾 Save" onPress={handleSave} style={{ flex: 1, marginRight: 8 }} />
            <Button
              title="Cancel"
              onPress={() => setEditMode(false)}
              style={{ flex: 1, marginLeft: 8 }}
            />
          </>
        )}
      </View>
    </View>
  );
}
