import express from 'express';
import Driver from '../models/Driver.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

// POST /api/drivers - Create a new driver
router.post('/', async (req, res) => {
  try {
    const { name, phone, licenseNumber, licenseType, availability } = req.body;

    if (!name || !licenseType) {
      return res.status(400).json({ message: 'Name and license type are required' });
    }

    const driver = await Driver.create({
      name,
      phone: phone || '',
      licenseNumber: licenseNumber || '',
      licenseType,
      availability: availability || undefined,
    });

    res.status(201).json({
      message: 'Driver created successfully',
      driver,
    });
  } catch (error) {
    console.error('Create driver error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/drivers - Get all drivers
router.get('/', async (req, res) => {
  try {
    const drivers = await Driver.find().sort({ createdAt: -1 });
    res.json(drivers);
  } catch (error) {
    console.error('Get drivers error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/drivers/:id - Delete a driver
router.delete('/:id', async (req, res) => {
  try {
    const driver = await Driver.findByIdAndDelete(req.params.id);
    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }

    res.json({ message: 'Driver deleted successfully' });
  } catch (error) {
    console.error('Delete driver error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;

