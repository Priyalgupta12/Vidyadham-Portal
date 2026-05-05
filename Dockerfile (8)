import express from 'express';
import Vehicle from '../models/Vehicle.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

// POST /api/vehicles - Create a new vehicle
router.post('/', async (req, res) => {
  try {
    const { vehicleNumber, capacity, type, fuelType, insuranceExpiry } = req.body;

    if (!vehicleNumber || !capacity || !type) {
      return res.status(400).json({ message: 'Vehicle number, capacity, and type are required' });
    }

    const existingVehicle = await Vehicle.findOne({
      vehicleNumber: vehicleNumber.toUpperCase().trim(),
    });
    if (existingVehicle) {
      return res.status(400).json({ message: 'A vehicle with this number already exists' });
    }

    const vehicle = await Vehicle.create({
      vehicleNumber,
      capacity,
      type,
      fuelType: fuelType || '',
      insuranceExpiry: insuranceExpiry || undefined,
    });

    res.status(201).json({
      message: 'Vehicle created successfully',
      vehicle,
    });
  } catch (error) {
    console.error('Create vehicle error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/vehicles - Get all vehicles
router.get('/', async (req, res) => {
  try {
    const vehicles = await Vehicle.find().sort({ createdAt: -1 });
    res.json(vehicles);
  } catch (error) {
    console.error('Get vehicles error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/vehicles/:id - Delete a vehicle
router.delete('/:id', async (req, res) => {
  try {
    const vehicle = await Vehicle.findByIdAndDelete(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    res.json({ message: 'Vehicle deleted successfully' });
  } catch (error) {
    console.error('Delete vehicle error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;

