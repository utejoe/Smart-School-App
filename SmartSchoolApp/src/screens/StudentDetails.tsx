import React from 'react';
import { View, Text } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { globalStyles } from '../theme/globalStyles';

type Props = NativeStackScreenProps<RootStackParamList, 'StudentDetails'>;

export default function StudentDetails({ route }: Props) {
  const { studentId } = route.params;

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.textPrimary}>Student Details</Text>
      <Text style={globalStyles.textSecondary}>ID: {studentId}</Text>
      {/* Later: fetch from backend */}
    </View>
  );
}
