// backend/controllers/teacherController.ts
import { Request, Response } from 'express';
import { AppDataSource } from '../db';
import { Teacher } from '../models/Teacher';
import { SchoolClass } from '../models/SchoolClass';
import { Subject } from '../models/Subject';

// Get all teachers (with subjects + classes)
export const getTeachers = async (req: Request, res: Response) => {
  try {
    const teacherRepo = AppDataSource.getRepository(Teacher);
    const teachers = await teacherRepo.find({
      relations: ['subjects', 'schoolClasses'],
    });
    res.json(teachers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch teachers' });
  }
};

// Get teacher by ID
export const getTeacherById = async (req: Request, res: Response) => {
  try {
    const teacherRepo = AppDataSource.getRepository(Teacher);
    const teacher = await teacherRepo.findOne({
      where: { id: parseInt(req.params.id) },
      relations: ['subjects', 'schoolClasses'],
    });

    if (!teacher) {
      return res.status(404).json({ error: 'Teacher not found' });
    }
    res.json(teacher);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch teacher' });
  }
};

// Create teacher
export const createTeacher = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, subjects = [], schoolClasses = [] } =
      req.body;

    const teacherRepo = AppDataSource.getRepository(Teacher);
    const subjectRepo = AppDataSource.getRepository(Subject);
    const classRepo = AppDataSource.getRepository(SchoolClass);

    // Ensure subjects exist or create them
    const subjectEntities: Subject[] = [];
    for (const subjName of subjects) {
      let subj = await subjectRepo.findOneBy({ name: subjName });
      if (!subj) {
        subj = subjectRepo.create({ name: subjName });
        await subjectRepo.save(subj);
      }
      subjectEntities.push(subj);
    }

    // Ensure schoolClasses exist or create them
    const classEntities: SchoolClass[] = [];
    for (const className of schoolClasses) {
      let cls = await classRepo.findOneBy({ name: className });
      if (!cls) {
        cls = classRepo.create({ name: className });
        await classRepo.save(cls);
      }
      classEntities.push(cls);
    }

    // Create teacher with relations
    const newTeacher = teacherRepo.create({
      firstName,
      lastName,
      email,
      subjects: subjectEntities,
      schoolClasses: classEntities,
    });

    await teacherRepo.save(newTeacher);
    res.status(201).json(newTeacher);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create teacher' });
  }
};

// Update teacher
export const updateTeacher = async (req: Request, res: Response) => {
  try {
    const teacherRepo = AppDataSource.getRepository(Teacher);
    const subjectRepo = AppDataSource.getRepository(Subject);
    const classRepo = AppDataSource.getRepository(SchoolClass);

    const teacher = await teacherRepo.findOne({
      where: { id: parseInt(req.params.id) },
      relations: ['subjects', 'schoolClasses'],
    });

    if (!teacher) {
      return res.status(404).json({ error: 'Teacher not found' });
    }

    const { firstName, lastName, email, subjects = [], schoolClasses = [] } =
      req.body;

    teacher.firstName = firstName ?? teacher.firstName;
    teacher.lastName = lastName ?? teacher.lastName;
    teacher.email = email ?? teacher.email;

    // Update subjects if provided
    if (subjects.length > 0) {
      const subjectEntities: Subject[] = [];
      for (const subjName of subjects) {
        let subj = await subjectRepo.findOneBy({ name: subjName });
        if (!subj) {
          subj = subjectRepo.create({ name: subjName });
          await subjectRepo.save(subj);
        }
        subjectEntities.push(subj);
      }
      teacher.subjects = subjectEntities;
    }

    // Update classes if provided
    if (schoolClasses.length > 0) {
      const classEntities: SchoolClass[] = [];
      for (const className of schoolClasses) {
        let cls = await classRepo.findOneBy({ name: className });
        if (!cls) {
          cls = classRepo.create({ name: className });
          await classRepo.save(cls);
        }
        classEntities.push(cls);
      }
      teacher.schoolClasses = classEntities;
    }

    await teacherRepo.save(teacher);
    res.json(teacher);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update teacher' });
  }
};

// Delete teacher
export const deleteTeacher = async (req: Request, res: Response) => {
  try {
    const teacherRepo = AppDataSource.getRepository(Teacher);
    const teacher = await teacherRepo.findOneBy({ id: parseInt(req.params.id) });

    if (!teacher) {
      return res.status(404).json({ error: 'Teacher not found' });
    }

    await teacherRepo.remove(teacher);
    res.json({ message: 'Teacher deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete teacher' });
  }
};

// Upload teacher photo
export const uploadTeacherPhoto = async (req: Request, res: Response) => {
  try {
    const teacherRepo = AppDataSource.getRepository(Teacher);
    const teacher = await teacherRepo.findOneBy({ id: parseInt(req.params.id) });

    if (!teacher) {
      return res.status(404).json({ error: 'Teacher not found' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Save file path as photoUrl
    teacher.photoUrl = `/uploads/${req.file.filename}`;
    await teacherRepo.save(teacher);

    res.json({ message: 'Photo uploaded successfully', teacher });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to upload photo' });
  }
};