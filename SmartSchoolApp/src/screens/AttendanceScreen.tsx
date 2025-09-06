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
  date: string;
  className: string;
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
      if (!teacher?.id) return;
      const res = await fetchAttendanceHistory(teacher.id);

      const formatted: AttendanceRecord[] = res.data.map((rec: any) => {
        const dt = new Date(rec.date);
        const dateStr = dt.toISOString().slice(0, 10);
        const timeStr = dt.toTimeString().slice(0, 5);
        return {
          id: rec.id,
          classId: rec.classId,
          date: `${dateStr} ${timeStr}`,
          className: rec.className,
          present: rec.present,
          absent: rec.absent,
        };
      });

      setAttendanceHistory(formatted);
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to load attendance history.');
    }
  }, [teacher]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const handleViewAttendance = (record: AttendanceRecord) => {
    navigation.navigate('AttendanceDetails', {
      classId: record.classId,
      date: record.date,
    });
  };

  const handleExportAttendance = (record: AttendanceRecord) => {
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
              {item.className} - {item.date}
            </Text>
            <Text style={globalStyles.textSecondary}>
              Present: {item.present} | Absent: {item.absent}
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
