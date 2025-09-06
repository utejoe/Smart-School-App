import { Request, Response } from 'express';
import { AppDataSource } from '../db';
import { Student } from '../models/Student';
import { SchoolClass } from '../models/SchoolClass';
import { exportToCSV } from '../utils/csvExport';

// ✅ Get all students
export const getStudents = async (req: Request, res: Response) => {
  try {
    const repo = AppDataSource.getRepository(Student);
    const students = await repo.find({ relations: ["schoolClass"] });
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch students" });
  }
};

// ✅ Get single student by ID
export const getStudentById = async (req: Request, res: Response) => {
  try {
    const repo = AppDataSource.getRepository(Student);
    const student = await repo.findOne({
      where: { id: parseInt(req.params.id) },
      relations: ["schoolClass"],
    });
    if (!student) return res.status(404).json({ error: "Student not found" });
    res.json(student);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch student" });
  }
};

// ✅ Create new student
export const createStudent = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, admissionNumber, classId } = req.body;

    const studentRepo = AppDataSource.getRepository(Student);
    const classRepo = AppDataSource.getRepository(SchoolClass);

    const schoolClass = await classRepo.findOneBy({ id: classId });
    if (!schoolClass) return res.status(404).json({ error: "Class not found" });

    const student = studentRepo.create({
      firstName,
      lastName,
      admissionNumber,
      schoolClass,
    });

    await studentRepo.save(student);
    res.status(201).json(student);
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to create student" });
  }
};

// ✅ Update student
export const updateStudent = async (req: Request, res: Response) => {
  try {
    const repo = AppDataSource.getRepository(Student);
    const student = await repo.findOneBy({ id: parseInt(req.params.id) });

    if (!student) return res.status(404).json({ error: "Student not found" });

    repo.merge(student, req.body);
    await repo.save(student);

    res.json(student);
  } catch (err) {
    res.status(500).json({ error: "Failed to update student" });
  }
};

// ✅ Delete student
export const deleteStudent = async (req: Request, res: Response) => {
  try {
    const repo = AppDataSource.getRepository(Student);
    const result = await repo.delete(req.params.id);

    if (result.affected === 0) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.json({ message: "Student deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete student" });
  }
};

// Export all students as CSV
export const exportStudentsCSV = async (req: Request, res: Response) => {
  try {
    const repo = AppDataSource.getRepository(Student);
    const students = await repo.find({ relations: ['schoolClass'] });

    // Flatten rows for CSV
    const rows = students.map((s) => ({
      id: s.id,
      firstName: s.firstName,
      lastName: s.lastName,
      admissionNumber: s.admissionNumber,
      class: s.schoolClass?.name || '',
    }));

    const headers = [
      { id: 'id', title: 'ID' },
      { id: 'firstName', title: 'First Name' },
      { id: 'lastName', title: 'Last Name' },
      { id: 'admissionNumber', title: 'Admission Number' },
      { id: 'class', title: 'Class' },
    ];

    exportToCSV(res, 'students.csv', headers, rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to export students CSV' });
  }
};
