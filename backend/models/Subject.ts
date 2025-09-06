// backend/models/Subject.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Teacher } from './Teacher';

@Entity()
export class Subject {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  name!: string; // e.g., Mathematics, English

  @ManyToMany(() => Teacher, (teacher) => teacher.subjects)
  teachers!: Teacher[];
}
