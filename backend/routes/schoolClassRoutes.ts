import { Router } from 'express';
import {
  getAllClasses,
  getClassById,
  createClass,
  updateClass,
  deleteClass,
  exportClassesCSV,
} from '../controllers/schoolClassController';

const router = Router();

router.get('/', getAllClasses);
router.get('/:id', getClassById);
router.post('/', createClass);
router.put('/:id', updateClass);
router.delete('/:id', deleteClass);
router.get('/export/csv', exportClassesCSV);

export default router;
