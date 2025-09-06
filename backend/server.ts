// backend/server.ts
import 'reflect-metadata';
import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

import { initializeDB } from './db';
import studentRoutes from './routes/studentRoutes';
import teacherRoutes from './routes/teacherRoutes';
import attendanceRoutes from './routes/attendanceRoutes';
import schoolClassRoutes from './routes/schoolClassRoutes';
import subjectRoutes from './routes/subjectRoutes';
import authRoutes from './routes/authRoutes';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// 👇 Serve uploads folder as static (for profile photos etc.)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/students', studentRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/classes', schoolClassRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/auth', authRoutes);

// Health check
app.get('/', (req: Request, res: Response) => {
  res.send({ message: 'Smart School API is running 🚀' });
});

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Initialize DB + Start Server
initializeDB().then(() => {
  app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
    console.log('DB_USER:', process.env.DB_USER);
    console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
    console.log(`📂 Serving uploads at http://localhost:${PORT}/uploads`);
  });
});
