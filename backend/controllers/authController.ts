// backend/controllers/authController.ts
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AppDataSource } from '../db';
import { Teacher } from '../models/Teacher';
import { Subject } from '../models/Subject';
import { SchoolClass } from '../models/SchoolClass';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

// Register new teacher
export const register = async (req: Request, res: Response) => {
  try {
    const { username, firstName, lastName, email, password, subjects = [], schoolClasses = [] } = req.body;

    const teacherRepo = AppDataSource.getRepository(Teacher);
    const existing = await teacherRepo.findOne({ where: [{ email }, { username }] });
    if (existing) {
      return res.status(400).json({ error: 'User already exists with this email/username' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Handle subjects
    const subjectRepo = AppDataSource.getRepository(Subject);
    const subjectEntities: Subject[] = [];
    for (const subjName of subjects) {
      let subj = await subjectRepo.findOneBy({ name: subjName });
      if (!subj) {
        subj = subjectRepo.create({ name: subjName });
        await subjectRepo.save(subj);
      }
      subjectEntities.push(subj);
    }

    // Handle classes
    const classRepo = AppDataSource.getRepository(SchoolClass);
    const classEntities: SchoolClass[] = [];
    for (const className of schoolClasses) {
      let cls = await classRepo.findOneBy({ name: className });
      if (!cls) {
        cls = classRepo.create({ name: className });
        await classRepo.save(cls);
      }
      classEntities.push(cls);
    }

    // Save new teacher
    const newTeacher = teacherRepo.create({
      username,
      firstName,
      lastName,
      email,
      password: hashedPassword,
      subjects: subjectEntities,
      schoolClasses: classEntities,
    });

    await teacherRepo.save(newTeacher);

    res.status(201).json({ message: 'Registration successful' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Registration failed' });
  }
};

// Login
export const login = async (req: Request, res: Response) => {
  try {
    const { emailOrUsername, password } = req.body;
    const teacherRepo = AppDataSource.getRepository(Teacher);

    const teacher = await teacherRepo.findOne({
      where: [{ email: emailOrUsername }, { username: emailOrUsername }],
      relations: ['subjects', 'schoolClasses'],
    });

    if (!teacher) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const validPass = await bcrypt.compare(password, teacher.password);
    if (!validPass) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: teacher.id, email: teacher.email }, JWT_SECRET, { expiresIn: '60d' });

    res.json({
      message: 'Login successful',
      token,
      teacher: {
        id: teacher.id,
        username: teacher.username,
        firstName: teacher.firstName,
        lastName: teacher.lastName,
        email: teacher.email,
        subjects: teacher.subjects,
        schoolClasses: teacher.schoolClasses,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Login failed' });
  }
};
