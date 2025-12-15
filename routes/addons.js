import express from 'express';
import Addon from '../models/Addon.js';
import { authenticate, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get all addons
router.get('/', authenticate, async (req, res) => {
  try {
    const addons = await Addon.find({ isActive: true }).sort({ category: 1, name: 1 });
    res.json(addons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get addon by ID
router.get('/:id', authenticate, async (req, res) => {
  try {
    const addon = await Addon.findById(req.params.id);
    if (!addon) {
      return res.status(404).json({ message: 'Addon not found' });
    }
    res.json(addon);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create addon (Admin only)
router.post('/', authenticate, isAdmin, async (req, res) => {
  try {
    const addon = new Addon(req.body);
    await addon.save();
    res.status(201).json(addon);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update addon (Admin only)
router.put('/:id', authenticate, isAdmin, async (req, res) => {
  try {
    const addon = await Addon.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!addon) {
      return res.status(404).json({ message: 'Addon not found' });
    }
    res.json(addon);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete addon (Admin only)
router.delete('/:id', authenticate, isAdmin, async (req, res) => {
  try {
    const addon = await Addon.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    if (!addon) {
      return res.status(404).json({ message: 'Addon not found' });
    }
    res.json({ message: 'Addon deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

