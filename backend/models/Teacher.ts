// backend/models/Teacher.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';
import { SchoolClass } from './SchoolClass';
import { Subject } from './Subject';
import { Attendance } from './Attendance';

// 👇 Define available roles
export type UserRole = 'teacher' | 'director' | 'admin' | 'owner';

@Entity()
export class Teacher {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  username!: string;

  @Column()
  firstName!: string;

  @Column()
  lastName!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column({ nullable: true }) // Optional profile photo
  photoUrl?: string;

  // 👇 Role column with default = "teacher"
  @Column({ type: 'varchar', default: 'teacher' })
  role!: UserRole;

  // Teacher ↔ Subject (Many-to-Many)
  @ManyToMany(() => Subject, (subject) => subject.teachers, { cascade: true })
  @JoinTable()
  subjects!: Subject[];

  // Teacher ↔ Class (Many-to-Many)
  @ManyToMany(() => SchoolClass, (schoolClass) => schoolClass.teachers, {
    cascade: true,
  })
  @JoinTable()
  schoolClasses!: SchoolClass[];

  // Teacher ↔ Attendance (One-to-Many)
  @OneToMany(() => Attendance, (attendance) => attendance.teacher)
  attendances!: Attendance[];
}
