// src/components/Sidebar/Sidebar.tsx
import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => (
  <div style={{ width: 220, background: '#f3f4f6', padding: 16 }}>
    <h3>Smart School</h3>
    <ul style={{ listStyle: 'none', padding: 0 }}>
      <li><Link to="/admin/dashboard">Dashboard</Link></li>
      <li><Link to="/admin/students">Students</Link></li>
      <li><Link to="/admin/teachers">Teachers</Link></li>
      <li><Link to="/admin/attendance">Attendance</Link></li>
      <li><Link to="/director/reports">Reports</Link></li>
      <li><Link to="/owner/overview">Overview</Link></li>
    </ul>
  </div>
);

export default Sidebar;
