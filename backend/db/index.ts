// backend/db/index.ts
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import dotenv from 'dotenv';

import { Student } from '../models/Student';
import { Teacher } from '../models/Teacher';
import { Attendance } from '../models/Attendance';
import { SchoolClass } from '../models/SchoolClass';
import { Subject } from '../models/Subject';  // ⬅️ Import Subject

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'smart_school',
  synchronize: true, // ⚠️ set false in production
  logging: false,
  entities: [Student, Teacher, Attendance, SchoolClass, Subject], // ⬅️ Register Subject
});

export const initializeDB = async () => {
  try {
    await AppDataSource.initialize();
    console.log('PostgreSQL Data Source has been initialized!');
  } catch (err) {
    console.error('Error during Data Source initialization', err);
  }
};
