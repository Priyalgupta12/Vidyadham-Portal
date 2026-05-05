import express from 'express';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '24h' });
};

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    // Find admin by email
    const admin = await Admin.findOne({ email: email.toLowerCase() });
    console.log(Admin.collection.name);
    if (!admin) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check password
    const isMatch = await admin.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Return token
    res.json({
      token: generateToken(admin._id),
      admin: {
        id: admin._id,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/auth/verify
router.get('/verify', protect, async (req, res) => {
  res.json({
    admin: {
      id: req.admin._id,
      email: req.admin.email,
      role: req.admin.role,
    },
  });
});

export default router;
