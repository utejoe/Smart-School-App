// src/services/api.ts
import axios from 'axios';
import { Platform } from 'react-native';

// 👇 change this to your machine LAN IP when testing on real devices
const LAN_IP = '192.168.43.242';
const PORT = '5000';

// Auto-detect: if running on Android Emulator → use 10.0.2.2
let API_BASE_URL = `http://localhost:${PORT}`;

if (Platform.OS === 'android') {
  API_BASE_URL = `http://${LAN_IP}:${PORT}`;
  if (!__DEV__) {
    API_BASE_URL = `http://10.0.2.2:${PORT}`;
  }
} else if (Platform.OS === 'ios') {
  API_BASE_URL = `http://localhost:${PORT}`;
}

// export API base for images
export const API_BASE = `${API_BASE_URL}/api`;

export const api = axios.create({ baseURL: API_BASE });

/* -------------------- AUTH -------------------- */
export const registerTeacher = (data: any) => api.post('/auth/register', data);
export const loginTeacher = (data: any) => api.post('/auth/login', data);

/* -------------------- STUDENTS -------------------- */
export const fetchStudents = () => api.get('/students');
export const fetchStudent = (id: number) => api.get(`/students/${id}`);
export const createStudent = (data: any) => api.post('/students', data);

/* -------------------- CLASSES -------------------- */
export const fetchClasses = () => api.get('/classes');

/* -------------------- ATTENDANCE -------------------- */
export const postAttendance = (payload: {
  studentId: number;
  schoolClassId: number;
  teacherId?: number;
  status: 'present' | 'absent' | 'late' | 'leave';
}) => api.post('/attendance', payload);

export const fetchAttendanceByStudent = (studentId: number) =>
  api.get(`/attendance/student/${studentId}`);

export const fetchAttendanceHistory = (teacherId: number) =>
  api.get(`/attendance?teacherId=${teacherId}`);

export const fetchAttendanceSession = (classId: number, date: string) =>
  api.get(`/attendance/session?classId=${classId}&date=${encodeURIComponent(date)}`);

// Update attendance record
export const updateAttendance = (attendanceId: number, payload: { status: 'present' | 'absent' | 'late' | 'leave' }) =>
  api.put(`/attendance/${attendanceId}`, payload);


/* -------------------- TEACHER -------------------- */
export const uploadTeacherPhoto = (teacherId: number, formData: FormData) =>
  api.post(`/teachers/${teacherId}/photo`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
