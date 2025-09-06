// backend/models/Teacher.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { SchoolClass } from './SchoolClass';
import { Subject } from './Subject';

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

  @Column({ nullable: true }) // 👈 NEW: optional profile photo
  photoUrl?: string;

  @ManyToMany(() => Subject, (subject) => subject.teachers, { cascade: true })
  @JoinTable()
  subjects!: Subject[];

  @ManyToMany(() => SchoolClass, (schoolClass) => schoolClass.teachers, {
    cascade: true,
  })
  @JoinTable()
  schoolClasses!: SchoolClass[];
}
