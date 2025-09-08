// SmartSchoolApp/src/screens/AttendanceScreen.tsx
import React, { useContext, useEffect, useState, useCallback } from 'react';
import { View, Text, Alert } from 'react-native';
import { globalStyles } from '../theme/globalStyles';
import Button from '../components/Button';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';
import { fetchAttendanceHistory } from '../services/api';
import RefreshableFlatList from '../components/RefreshableFlatList';

type AttendanceScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

type AttendanceRecord = {
  id: number;
  classId: number;
  className: string;
  subjectId?: number;
  subjectName?: string;
  date: string;
  present: number;
  absent: number;
  late?: number;
  leave?: number;
};

export default function AttendanceScreen() {
  const navigation = useNavigation<AttendanceScreenNavigationProp>();
  const { teacher } = useContext(AuthContext);

  const [attendanceHistory, setAttendanceHistory] = useState<AttendanceRecord[]>([]);

  const loadHistory = useCallback(async () => {
    try {
      if (!teacher?.id) {
        console.warn("[DEBUG] Teacher not found in context");
        return;
      }

      console.log("[DEBUG] Fetching attendance history for teacherId:", teacher.id);

      const res = await fetchAttendanceHistory(teacher.id);

      console.log("[DEBUG] Raw API Response:", JSON.stringify(res.data, null, 2));

      const formatted: AttendanceRecord[] = res.data.map((rec: any, idx: number) => {
        const dt = new Date(rec.date);
        const dateStr = dt.toISOString().slice(0, 10);
        const timeStr = dt.toTimeString().slice(0, 5);

        console.log(
          `[DEBUG] Mapping record ${idx}:`,
          "className:", rec.className,
          "subjectName:", rec.subjectName,
          "subjectId:", rec.subjectId
        );

        return {
          id: rec.id || idx + 1,
          classId: rec.classId,
          className: rec.className,
          subjectId: rec.subjectId,
          subjectName: rec.subjectName,
          date: `${dateStr} ${timeStr}`,
          present: rec.present,
          absent: rec.absent,
          late: rec.late ?? 0,
          leave: rec.leave ?? 0,
        };
      });

      console.log("[DEBUG] Formatted Records:", formatted);

      setAttendanceHistory(formatted);
    } catch (err) {
      console.error("[DEBUG] Error fetching attendance history:", err);
      Alert.alert('Error', 'Failed to load attendance history.');
    }
  }, [teacher]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const handleViewAttendance = (record: AttendanceRecord) => {
    console.log("[DEBUG] Navigating to AttendanceDetails with:", record);
    navigation.navigate('AttendanceDetails', {
      classId: record.classId,
      date: record.date,
    });
  };

  const handleExportAttendance = (record: AttendanceRecord) => {
    console.log("[DEBUG] Export pressed for:", record);
    Alert.alert('Export', `Attendance for ${record.className} on ${record.date} exported!`);
  };

  return (
    <View style={globalStyles.container}>
      <Text style={[globalStyles.textPrimary, { fontSize: 20, marginBottom: 16 }]}>
        Attendance History
      </Text>

      <RefreshableFlatList
        data={attendanceHistory}
        onReload={loadHistory}
        keyExtractor={(item: AttendanceRecord) => item.id.toString()}
        renderItem={({ item }: { item: AttendanceRecord }) => (
          <View style={globalStyles.card}>
            <Text style={globalStyles.textPrimary}>
              {item.className} - {item.subjectName ?? 'No Subject'}
            </Text>
            <Text style={globalStyles.textSecondary}>
              {item.date}
            </Text>
            <Text style={globalStyles.textSecondary}>
              Present: {item.present} | Absent: {item.absent} | Late: {item.late} | Leave: {item.leave}
            </Text>

            <View style={{ flexDirection: 'row', marginTop: 8 }}>
              <Button
                title="Export & Send"
                onPress={() => handleExportAttendance(item)}
                style={{ flex: 1, marginRight: 6 }}
              />
              <Button
                title="View Attendance"
                onPress={() => handleViewAttendance(item)}
                style={{ flex: 1, marginLeft: 6 }}
              />
            </View>
          </View>
        )}
      />
    </View>
  );
}
