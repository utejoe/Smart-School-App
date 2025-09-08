// backend/models/Attendance.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Student } from './Student';
import { SchoolClass } from './SchoolClass';
import { Teacher } from './Teacher';
import { Subject } from './Subject';

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'leave';

@Entity()
export class Attendance {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Student, { nullable: false })
  student!: Student;

  @ManyToOne(() => SchoolClass, { nullable: false })
  schoolClass!: SchoolClass;

  // ✅ Link Attendance → Teacher (bidirectional with Teacher.attendances)
  @ManyToOne(() => Teacher, (teacher) => teacher.attendances, { nullable: true })
  teacher?: Teacher;

  // ✅ Link Attendance → Subject
  @ManyToOne(() => Subject, { nullable: true })
  subject?: Subject;

  @Column({
    type: 'enum',
    enum: ['present', 'absent', 'late', 'leave'],
    default: 'present',
  })
  status!: AttendanceStatus;

  @CreateDateColumn()
  date!: Date;
}
