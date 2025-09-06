// backend/routes/attendanceRoutes.ts
import { Router } from 'express';
import {
  getAllAttendance,
  getAttendanceByStudent,
  getAttendanceById,
  getAttendanceSession,   // <-- import new controller
  createAttendance,
  updateAttendance,
  deleteAttendance,
} from '../controllers/attendanceController';

const router = Router();

// ✅ Attendance CRUD routes
// Get all records OR filter by teacherId via query param
router.get('/', getAllAttendance);

// ✅ NEW: Get full session (must come BEFORE "/:id")
router.get('/session', getAttendanceSession);

// Get attendance by student
router.get('/student/:studentId', getAttendanceByStudent);

// Get by single record ID
router.get('/:id', getAttendanceById);

// Create new attendance record
router.post('/', createAttendance);

// Update existing attendance record
router.put('/:id', updateAttendance);

// Delete attendance record
router.delete('/:id', deleteAttendance);

export default router;
