import { Router } from 'express';
import multer from 'multer';
import {
  getTeachers,
  getTeacherById,
  createTeacher,
  updateTeacher,
  deleteTeacher,
  uploadTeacherPhoto,
} from '../controllers/teacherController';

const router = Router();

// Configure multer storage
const storage = multer.diskStorage({
  destination: 'uploads/', // save in backend/uploads
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage });

router.get('/', getTeachers);
router.get('/:id', getTeacherById);
router.post('/', createTeacher);
router.put('/:id', updateTeacher);
router.delete('/:id', deleteTeacher);

// 👇 NEW route for uploading profile photo
router.post('/:id/photo', upload.single('photo'), uploadTeacherPhoto);

export default router;
