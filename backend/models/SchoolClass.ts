// backend/models/SchoolClass.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany } from 'typeorm';
import { Student } from './Student';
import { Teacher } from './Teacher';

@Entity()
export class SchoolClass {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string; // e.g., JSS1 Science

  @OneToMany(() => Student, (student) => student.schoolClass)
  students!: Student[];

  @ManyToMany(() => Teacher, (teacher) => teacher.schoolClasses)
  teachers!: Teacher[];
}
