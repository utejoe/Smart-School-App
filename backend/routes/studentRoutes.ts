import { Router } from 'express';
import {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  exportStudentsCSV,
} from '../controllers/studentController';

const router = Router();

router.get('/', getStudents);        // GET all students
router.get('/:id', getStudentById);  // GET student by ID
router.post('/', createStudent);     // POST create new student
router.put('/:id', updateStudent);   // PUT update student
router.delete('/:id', deleteStudent); // DELETE student
router.get('/export/csv', exportStudentsCSV); // CSV export route

export default router; 
