// src/pages/admin/Attendance.tsx
import React from 'react';
import Card from '../../components/Card/Card';
import Button from '../../components/Button/Button';
import Table from '../../components/Table/Table';

const Attendance = () => {
  const attendanceRecords = [
    { id: 1, student: 'Alice Johnson', date: '2025-09-08', status: 'Present' },
    { id: 2, student: 'Bob Smith', date: '2025-09-08', status: 'Absent' },
    { id: 3, student: 'Charlie Brown', date: '2025-09-08', status: 'Present' },
  ];

  return (
    <div>
      <h2>Attendance</h2>
      <Button>Mark Attendance</Button>
      <Card>
        <Table
          columns={['ID', 'Student', 'Date', 'Status']}
          data={attendanceRecords.map(a => [a.id, a.student, a.date, a.status])}
        />
      </Card>
    </div>
  );
};

export default Attendance;
