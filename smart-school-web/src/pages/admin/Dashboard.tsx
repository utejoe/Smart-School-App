import React from 'react';
import Card from '../../components/Card/Card';

const AdminDashboard = () => {
  return (
    <div>
      <h2>Admin Dashboard</h2>
      <Card>
        <p>Welcome, Admin! Overview of school stats will appear here.</p>
      </Card>
      <Card>
        <p>Total Students: 120</p>
        <p>Total Teachers: 15</p>
        <p>Attendance Today: 110</p>
      </Card>
    </div>
  );
};

export default AdminDashboard;
