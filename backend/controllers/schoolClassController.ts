import { Request, Response } from 'express';
import { AppDataSource } from '../db';
import { SchoolClass } from '../models/SchoolClass';
import { exportToCSV } from '../utils/csvExport';
// import { Student } from '../models/Student';
// import { Teacher } from '../models/Teacher';

// Get all classes
export const getAllClasses = async (req: Request, res: Response) => {
  try {
    const repo = AppDataSource.getRepository(SchoolClass);
    const classes = await repo.find({ relations: ['students', 'teachers'] });
    res.json(classes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch classes' });
  }
};

// Get single class by ID
export const getClassById = async (req: Request, res: Response) => {
  try {
    const repo = AppDataSource.getRepository(SchoolClass);
    const schoolClass = await repo.findOne({
      where: { id: parseInt(req.params.id) },
      relations: ['students', 'teachers'],
    });
    if (!schoolClass) return res.status(404).json({ error: 'Class not found' });
    res.json(schoolClass);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch class' });
  }
};

// Create a new class
export const createClass = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    const repo = AppDataSource.getRepository(SchoolClass);

    const existing = await repo.findOneBy({ name });
    if (existing) return res.status(400).json({ error: 'Class already exists' });

    const newClass = repo.create({ name });
    await repo.save(newClass);
    res.status(201).json(newClass);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create class' });
  }
};

// Update class
export const updateClass = async (req: Request, res: Response) => {
  try {
    const repo = AppDataSource.getRepository(SchoolClass);
    const schoolClass = await repo.findOneBy({ id: parseInt(req.params.id) });
    if (!schoolClass) return res.status(404).json({ error: 'Class not found' });

    repo.merge(schoolClass, req.body);
    await repo.save(schoolClass);
    res.json(schoolClass);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update class' });
  }
};

// Delete class
export const deleteClass = async (req: Request, res: Response) => {
  try {
    const repo = AppDataSource.getRepository(SchoolClass);
    const result = await repo.delete(req.params.id);
    if (result.affected === 0) return res.status(404).json({ error: 'Class not found' });
    res.json({ message: 'Class deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete class' });
  }
};

// ✅ Export all classes to CSV
export const exportClassesCSV = async (req: Request, res: Response) => {
  try {
    const repo = AppDataSource.getRepository(SchoolClass);
    const classes = await repo.find({ relations: ['students', 'teachers'] });

    const rows = classes.map((cls) => ({
      id: cls.id,
      name: cls.name,
      studentCount: cls.students?.length || 0,
      teacherCount: cls.teachers?.length || 0,
    }));

    exportToCSV(
      res,
      'classes.csv',
      [
        { id: 'id', title: 'ID' },
        { id: 'name', title: 'Class Name' },
        { id: 'studentCount', title: 'No. of Students' },
        { id: 'teacherCount', title: 'No. of Teachers' },
      ],
      rows
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to export classes to CSV' });
  }
};