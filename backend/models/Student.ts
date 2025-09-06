import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { SchoolClass } from './SchoolClass';

@Entity()
export class Student {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  firstName!: string;

  @Column()
  lastName!: string;

  @Column({ unique: true })
  admissionNumber!: string;

  @ManyToOne(() => SchoolClass, (schoolClass) => schoolClass.students)
  schoolClass!: SchoolClass;
}
