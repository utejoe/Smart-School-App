// src/pages/admin/Students.tsx
import React from 'react';
import Card from '../../components/Card/Card';
import Button from '../../components/Button/Button';
import Table from '../../components/Table/Table';

const Students = () => {
  const students = [
    { id: 1, name: 'Alice Johnson', class: 'JSS1', status: 'Active' },
    { id: 2, name: 'Bob Smith', class: 'JSS2', status: 'Active' },
    { id: 3, name: 'Charlie Brown', class: 'JSS3', status: 'Inactive' },
  ];

  return (
    <div>
      <h2>Students</h2>
      <Button>Add New Student</Button>
      <Card>
        <Table
          columns={['ID', 'Name', 'Class', 'Status']}
          data={students.map(s => [s.id, s.name, s.class, s.status])}
        />
      </Card>
    </div>
  );
};

export default Students;
