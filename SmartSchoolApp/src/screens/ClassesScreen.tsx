// SmartSchoolApp/src/screens/ClassesScreen.tsx
import React, { useContext, useEffect, useState } from 'react';
import { View, Text, FlatList, Alert } from 'react-native';
import { globalStyles } from '../theme/globalStyles';
import Button from '../components/Button';
import { AuthContext } from '../context/AuthContext';
import Card from '../components/Card';

export default function ClassesScreen() {
  const { teacher } = useContext(AuthContext);
  const [classes, setClasses] = useState<any[]>([]);

  // Load teacher’s assigned classes
  useEffect(() => {
    if (teacher) {
      setClasses(teacher.schoolClasses || []);
    }
  }, [teacher]);

  // Placeholder: export students list
  const handleExportClass = (cls: any) => {
    Alert.alert('Export', `Class list for ${cls.name} exported!`);
  };

  // Placeholder: view students
  const handleViewStudents = (cls: any) => {
    Alert.alert('Students', `Show student list for ${cls.name}`);
    // 👉 Later, navigate to StudentDetails screen
  };

  // Placeholder: import classes
  const handleImportClasses = () => {
    Alert.alert('Import', 'Class import feature coming soon (CSV / Manual).');
    // 👉 Later, implement CSV upload or manual entry modal
  };

  return (
    <View style={globalStyles.container}>
      <Text
        style={[globalStyles.textPrimary, { fontSize: 20, marginBottom: 16 }]}
      >
        📘 Manage Classes
      </Text>

      {/* Import Button */}
      <Button
        title="➕ Import Classes"
        onPress={handleImportClasses}
        style={{ marginBottom: 16 }}
      />

      {classes.length === 0 ? (
        <Text style={globalStyles.textSecondary}>
          No classes assigned yet.
        </Text>
      ) : (
        <FlatList
          data={classes}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <Card>
              <Text style={globalStyles.textPrimary}>{item.name}</Text>
              <Text style={globalStyles.textSecondary}>
                Students: {item.students?.length || 0}
              </Text>

              {/* Buttons */}
              <View style={{ flexDirection: 'row', marginTop: 10 }}>
                <Button
                  title="View Students"
                  onPress={() => handleViewStudents(item)}
                  style={{ flex: 1, marginRight: 6 }}
                />
                <Button
                  title="Export CSV"
                  onPress={() => handleExportClass(item)}
                  style={{ flex: 1, marginLeft: 6 }}
                />
              </View>
            </Card>
          )}
        />
      )}
    </View>
  );
}
