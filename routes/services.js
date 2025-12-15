import express from 'express';
import Service from '../models/Service.js';
import { authenticate, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get all services
router.get('/', authenticate, async (req, res) => {
  try {
    const services = await Service.find({ isActive: true })
      .populate('addons')
      .sort({ category: 1, name: 1 });
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get service by ID
router.get('/:id', authenticate, async (req, res) => {
  try {
    const service = await Service.findById(req.params.id).populate('addons');
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create service (Admin only)
router.post('/', authenticate, isAdmin, async (req, res) => {
  try {
    const service = new Service(req.body);
    await service.save();
    res.status(201).json(service);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update service (Admin only)
router.put('/:id', authenticate, isAdmin, async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.json(service);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete service (Admin only)
router.delete('/:id', authenticate, isAdmin, async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

