// src/pages/admin/Teachers.tsx
import React from 'react';
import Card from '../../components/Card/Card';
import Button from '../../components/Button/Button';
import Table from '../../components/Table/Table';

const Teachers = () => {
  const teachers = [
    { id: 1, name: 'Mr. Adams', subject: 'Math', class: 'JSS1' },
    { id: 2, name: 'Mrs. Baker', subject: 'English', class: 'JSS2' },
    { id: 3, name: 'Mr. Clark', subject: 'Science', class: 'JSS3' },
  ];

  return (
    <div>
      <h2>Teachers</h2>
      <Button>Add New Teacher</Button>
      <Card>
        <Table
          columns={['ID', 'Name', 'Subject', 'Class']}
          data={teachers.map(t => [t.id, t.name, t.subject, t.class])}
        />
      </Card>
    </div>
  );
};

export default Teachers;
