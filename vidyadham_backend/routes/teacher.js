import express from 'express';
import Teacher from '../models/Teacher.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes are protected — admin only
router.use(protect);

// POST /api/teachers — Create a new teacher
router.post('/', async (req, res) => {
  try {
    const { name, email, password, subject, subjects, phone, availability } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    // Check if teacher with this email already exists
    const existingTeacher = await Teacher.findOne({ email: email.toLowerCase() });
    if (existingTeacher) {
      return res.status(400).json({ message: 'A teacher with this email already exists' });
    }

    const teacher = await Teacher.create({
      name,
      email: email.toLowerCase(),
      password,
      subject: subject || subjects?.[0] || '',
      subjects: Array.isArray(subjects) ? subjects : subject ? [subject] : [],
      phone: phone || '',
      availability: availability || undefined,
    });

    res.status(201).json({
      message: 'Teacher created successfully',
      teacher,
    });
  } catch (error) {
    console.error('Create teacher error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/teachers — Get all teachers
router.get('/', async (req, res) => {
  try {
    const teachers = await Teacher.find().sort({ createdAt: -1 });
    res.json(teachers);
  } catch (error) {
    console.error('Get teachers error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/teachers/:id — Delete a teacher
router.delete('/:id', async (req, res) => {
  try {
    const teacher = await Teacher.findByIdAndDelete(req.params.id);
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }
    res.json({ message: 'Teacher deleted successfully' });
  } catch (error) {
    console.error('Delete teacher error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
