// backend/db/seed.ts
import { AppDataSource } from './index';
import { SchoolClass } from '../models/SchoolClass';
import { Subject } from '../models/Subject';
import { Teacher } from '../models/Teacher';
import { Student } from '../models/Student';
import { In } from 'typeorm';

const classes = ['JSS1', 'JSS2', 'JSS3', 'SS1', 'SS2', 'SS3'];
const subjects = [
  'Mathematics',
  'English',
  'Physics',
  'Chemistry',
  'Biology',
  'Economics',
  'Literature',
  'Government',
];

// 👨‍🎓 Some Nigerian-style names for students
const sampleNames = [
  ['John', 'Okafor'],
  ['Mary', 'Adebayo'],
  ['Emeka', 'Eze'],
  ['Grace', 'Olawale'],
  ['Tunde', 'Ogunleye'],
  ['Chika', 'Nwankwo'],
  ['Samuel', 'Adeyemi'],
  ['Ngozi', 'Okonjo'],
  ['David', 'Balogun'],
  ['Amaka', 'Ifeanyi'],
];

async function seed() {
  try {
    await AppDataSource.initialize();
    console.log('📦 Connected to DB for seeding...');

    const classRepo = AppDataSource.getRepository(SchoolClass);
    const subjectRepo = AppDataSource.getRepository(Subject);
    const teacherRepo = AppDataSource.getRepository(Teacher);
    const studentRepo = AppDataSource.getRepository(Student);

    // Seed classes
    for (const name of classes) {
      const exists = await classRepo.findOneBy({ name });
      if (!exists) {
        const cls = classRepo.create({ name });
        await classRepo.save(cls);
        console.log(`✅ Added class: ${name}`);
      }
    }

    // Seed subjects
    for (const name of subjects) {
      const exists = await subjectRepo.findOneBy({ name });
      if (!exists) {
        const subj = subjectRepo.create({ name });
        await subjectRepo.save(subj);
        console.log(`✅ Added subject: ${name}`);
      }
    }

    // --- Seed Teachers ---
    const getSubjects = async (names: string[]) =>
      await subjectRepo.findBy({ name: In(names) });
    const getClasses = async (names: string[]) =>
      await classRepo.findBy({ name: In(names) });

    const uyiExists = await teacherRepo.findOneBy({ email: 'uyi.obazee@example.com' });
    if (!uyiExists) {
      const uyi = teacherRepo.create({
        firstName: 'Uyi',
        lastName: 'Obazee',
        email: 'uyi.obazee@example.com',
        username: 'uyi.obazee',
        password: 'defaultpassword',
        subjects: await getSubjects(['Mathematics', 'Physics']),
        schoolClasses: await getClasses(['JSS1', 'SS2']),
      });
      await teacherRepo.save(uyi);
      console.log('👨‍🏫 Added teacher: Uyi Obazee');
    }

    const jamesExists = await teacherRepo.findOneBy({ email: 'james.okoro@example.com' });
    if (!jamesExists) {
      const james = teacherRepo.create({
        firstName: 'James',
        lastName: 'Okoro',
        email: 'james.okoro@example.com',
        username: 'james.okoro',
        password: 'defaultpassword',
        subjects: await getSubjects(['English']),
        schoolClasses: await getClasses(['SS1', 'SS2']),
      });
      await teacherRepo.save(james);
      console.log('👨‍🏫 Added teacher: James Okoro');
    }

    const adaExists = await teacherRepo.findOneBy({ email: 'ada.nwosu@example.com' });
    if (!adaExists) {
      const ada = teacherRepo.create({
        firstName: 'Ada',
        lastName: 'Nwosu',
        email: 'ada.nwosu@example.com',
        username: 'ada.nwosu',
        password: 'defaultpassword',
        subjects: await getSubjects(['Biology', 'Chemistry']),
        schoolClasses: await getClasses(['SS2', 'SS3']),
      });
      await teacherRepo.save(ada);
      console.log('👩‍🏫 Added teacher: Ada Nwosu');
    }

    // --- Seed Students ---
    const allClasses = await classRepo.find();
    for (const cls of allClasses) {
      const students = [];
      for (let i = 0; i < 10; i++) {
        const [firstName, lastName] = sampleNames[i % sampleNames.length];
        students.push(
          studentRepo.create({
            firstName,
            lastName,
            admissionNumber: `${cls.name}-ADM-${i + 1}`,
            schoolClass: cls,
          })
        );
      }
      await studentRepo.save(students);
      console.log(`👨‍🎓 Seeded 10 students for ${cls.name}`);
    }

    console.log('🎉 Seeding complete!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed', err);
    process.exit(1);
  }
}

seed();
