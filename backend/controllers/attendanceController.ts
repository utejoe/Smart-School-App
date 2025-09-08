// backend/controllers/attendanceController.ts
import { Request, Response } from 'express';
import { AppDataSource } from '../db';
import { Attendance, AttendanceStatus } from '../models/Attendance';
import { Student } from '../models/Student';
import { SchoolClass } from '../models/SchoolClass';
import { Teacher } from '../models/Teacher';
import { Subject } from '../models/Subject';
import { Between } from 'typeorm';

// ✅ Get all attendance records (grouped by class + subject + date)
export const getAllAttendance = async (req: Request, res: Response) => {
  try {
    const { teacherId } = req.query;

    const qb = AppDataSource.getRepository(Attendance)
      .createQueryBuilder('attendance')
      .leftJoin('attendance.schoolClass', 'schoolClass')
      .leftJoin('attendance.teacher', 'teacher')
      .leftJoin('attendance.subject', 'subject') // ✅ join subject
      .select('attendance.schoolClassId', 'classId')
      .addSelect('schoolClass.name', 'className')
      .addSelect('subject.id', 'subjectId')
      .addSelect('subject.name', 'subjectName')
      .addSelect("DATE_TRUNC('minute', attendance.date)", 'date')
      .addSelect(
        `SUM(CASE WHEN attendance.status = 'present' THEN 1 ELSE 0 END)`,
        'present'
      )
      .addSelect(
        `SUM(CASE WHEN attendance.status = 'absent' THEN 1 ELSE 0 END)`,
        'absent'
      )
      .addSelect(
        `SUM(CASE WHEN attendance.status = 'late' THEN 1 ELSE 0 END)`,
        'late'
      )
      .addSelect(
        `SUM(CASE WHEN attendance.status = 'leave' THEN 1 ELSE 0 END)`,
        'leave'
      )
      .groupBy('attendance.schoolClassId')
      .addGroupBy('schoolClass.name')
      .addGroupBy('subject.id')
      .addGroupBy('subject.name')
      .addGroupBy("DATE_TRUNC('minute', attendance.date)")
      .orderBy("DATE_TRUNC('minute', attendance.date)", 'DESC');

    if (teacherId) {
      qb.andWhere('attendance.teacherId = :teacherId', { teacherId });
    }

    const rawResults = await qb.getRawMany();

    const formatted = rawResults.map((r, idx) => ({
      id: idx + 1,
      classId: r.classId,
      className: r.className,
      subjectId: r.subjectId,
      subjectName: r.subjectName,
      date: r.date,
      present: Number(r.present),
      absent: Number(r.absent),
      late: Number(r.late),
      leave: Number(r.leave),
    }));

    res.json(formatted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch attendance records' });
  }
};

// ✅ Get attendance by ID
export const getAttendanceById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const attendanceRepo = AppDataSource.getRepository(Attendance);

    const record = await attendanceRepo.findOne({
      where: { id },
      relations: ['student', 'schoolClass', 'teacher', 'subject'],
    });

    if (!record) {
      return res.status(404).json({ error: 'Attendance record not found' });
    }

    res.json(record);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch attendance record' });
  }
};

// ✅ Get attendance by student ID
export const getAttendanceByStudent = async (req: Request, res: Response) => {
  try {
    const studentId = parseInt(req.params.studentId);
    const repo = AppDataSource.getRepository(Attendance);

    const records = await repo.find({
      where: { student: { id: studentId } },
      relations: ['student', 'schoolClass', 'teacher', 'subject'],
      order: { date: 'DESC' },
    });

    res.json(records);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch attendance for student' });
  }
};

// ✅ Get full attendance session (by class + date)
export const getAttendanceSession = async (req: Request, res: Response) => {
  try {
    const { classId, date } = req.query;
    if (!classId || !date) {
      return res.status(400).json({ error: 'classId and date are required' });
    }

    const attendanceRepo = AppDataSource.getRepository(Attendance);

    const start = new Date(date as string);
    start.setSeconds(0, 0);

    const end = new Date(start);
    end.setMinutes(end.getMinutes() + 1);

    const records = await attendanceRepo.find({
      where: {
        schoolClass: { id: Number(classId) },
        date: Between(start, end),
      },
      relations: ['student', 'schoolClass', 'teacher', 'subject'],
      order: { student: { id: 'ASC' } },
    });

    if (records.length === 0) {
      return res.status(404).json({ error: 'No attendance records found for this session' });
    }

    res.json({
      schoolClass: records[0].schoolClass,
      teacher: records[0].teacher,
      subject: records[0].subject, // ✅ include subject
      date: records[0].date,
      students: records.map((r) => ({
        id: r.student.id,
        firstName: r.student.firstName,
        lastName: r.student.lastName,
        admissionNumber: r.student.admissionNumber,
        status: r.status,
      })),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch attendance session' });
  }
};

// ✅ Create attendance record
export const createAttendance = async (req: Request, res: Response) => {
  try {
    const { studentId, schoolClassId, teacherId, subjectId, status } = req.body;

    const studentRepo = AppDataSource.getRepository(Student);
    const classRepo = AppDataSource.getRepository(SchoolClass);
    const teacherRepo = AppDataSource.getRepository(Teacher);
    const subjectRepo = AppDataSource.getRepository(Subject);
    const attendanceRepo = AppDataSource.getRepository(Attendance);

    const student = await studentRepo.findOneBy({ id: studentId });
    if (!student) return res.status(404).json({ error: 'Student not found' });

    const schoolClass = await classRepo.findOneBy({ id: schoolClassId });
    if (!schoolClass) return res.status(404).json({ error: 'Class not found' });

    let teacher: Teacher | null = null;
    if (teacherId) {
      teacher = await teacherRepo.findOneBy({ id: teacherId });
      if (!teacher) return res.status(404).json({ error: 'Teacher not found' });
    }

    let subject: Subject | null = null;
    if (subjectId) {
      subject = await subjectRepo.findOneBy({ id: subjectId });
      if (!subject) return res.status(404).json({ error: 'Subject not found' });
    }

    const newRecord = attendanceRepo.create({
      student,
      schoolClass,
      teacher: teacher || undefined,
      subject: subject || undefined,   // ✅ save subject
      status: (status as AttendanceStatus) || 'present',
      date: new Date(new Date().setSeconds(0, 0)),
    });

    await attendanceRepo.save(newRecord);
    res.status(201).json(newRecord);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create attendance record' });
  }
};

// ✅ Update attendance record
export const updateAttendance = async (req: Request, res: Response) => {
  try {
    const attendanceRepo = AppDataSource.getRepository(Attendance);
    const record = await attendanceRepo.findOne({
      where: { id: parseInt(req.params.id) },
      relations: ['student', 'schoolClass', 'teacher', 'subject'],
    });
    if (!record) return res.status(404).json({ error: 'Attendance record not found' });

    const { status } = req.body;
    if (status) record.status = status as AttendanceStatus;

    await attendanceRepo.save(record);
    res.json(record);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update attendance record' });
  }
};

// ✅ Delete attendance record
export const deleteAttendance = async (req: Request, res: Response) => {
  try {
    const attendanceRepo = AppDataSource.getRepository(Attendance);
    const result = await attendanceRepo.delete(req.params.id);
    if (result.affected === 0)
      return res.status(404).json({ error: 'Attendance record not found' });

    res.json({ message: 'Attendance record deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete attendance record' });
  }
};
