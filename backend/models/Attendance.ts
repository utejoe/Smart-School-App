// backend/models/Attendance.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Student } from './Student';
import { SchoolClass } from './SchoolClass';
import { Teacher } from './Teacher';

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'leave';

@Entity()
export class Attendance {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Student, { nullable: false })
  student!: Student;

  @ManyToOne(() => SchoolClass, { nullable: false })
  schoolClass!: SchoolClass;

  @ManyToOne(() => Teacher, { nullable: true })
  teacher?: Teacher; // Teacher who took attendance

  @Column({
    type: 'enum',
    enum: ['present', 'absent', 'late', 'leave'],
    default: 'present',
  })
  status!: AttendanceStatus;

  @CreateDateColumn()
  date!: Date;
}
