import { Request, Response } from 'express';
import { AppDataSource } from '../db';
import { Subject } from '../models/Subject';
import { Teacher } from '../models/Teacher';

// Get all subjects
export const getAllSubjects = async (req: Request, res: Response) => {
  try {
    const repo = AppDataSource.getRepository(Subject);
    const subjects = await repo.find({ relations: ['teachers'] });
    res.json(subjects);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch subjects' });
  }
};

// Get single subject by ID
export const getSubjectById = async (req: Request, res: Response) => {
  try {
    const repo = AppDataSource.getRepository(Subject);
    const subject = await repo.findOne({
      where: { id: parseInt(req.params.id) },
      relations: ['teachers'],
    });
    if (!subject) return res.status(404).json({ error: 'Subject not found' });
    res.json(subject);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch subject' });
  }
};

// Create a new subject
export const createSubject = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    const repo = AppDataSource.getRepository(Subject);

    const existing = await repo.findOneBy({ name });
    if (existing) return res.status(400).json({ error: 'Subject already exists' });

    const newSubject = repo.create({ name });
    await repo.save(newSubject);
    res.status(201).json(newSubject);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create subject' });
  }
};

// Update subject
export const updateSubject = async (req: Request, res: Response) => {
  try {
    const repo = AppDataSource.getRepository(Subject);
    const subject = await repo.findOneBy({ id: parseInt(req.params.id) });
    if (!subject) return res.status(404).json({ error: 'Subject not found' });

    repo.merge(subject, req.body);
    await repo.save(subject);
    res.json(subject);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update subject' });
  }
};

// Delete subject
export const deleteSubject = async (req: Request, res: Response) => {
  try {
    const repo = AppDataSource.getRepository(Subject);
    const result = await repo.delete(req.params.id);
    if (result.affected === 0) return res.status(404).json({ error: 'Subject not found' });
    res.json({ message: 'Subject deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete subject' });
  }
};
