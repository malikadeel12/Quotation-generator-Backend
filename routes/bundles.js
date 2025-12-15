import express from 'express';
import Bundle from '../models/Bundle.js';
import { authenticate, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get all bundles
router.get('/', authenticate, async (req, res) => {
  try {
    const bundles = await Bundle.find({ isActive: true })
      .populate('services')
      .populate('addons')
      .sort({ name: 1 });
    res.json(bundles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get bundle by ID
router.get('/:id', authenticate, async (req, res) => {
  try {
    const bundle = await Bundle.findById(req.params.id)
      .populate('services')
      .populate('addons');
    if (!bundle) {
      return res.status(404).json({ message: 'Bundle not found' });
    }
    res.json(bundle);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create bundle (Admin only)
router.post('/', authenticate, isAdmin, async (req, res) => {
  try {
    const bundle = new Bundle(req.body);
    await bundle.save();
    const populated = await Bundle.findById(bundle._id)
      .populate('services')
      .populate('addons');
    res.status(201).json(populated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update bundle (Admin only)
router.put('/:id', authenticate, isAdmin, async (req, res) => {
  try {
    const bundle = await Bundle.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('services').populate('addons');
    if (!bundle) {
      return res.status(404).json({ message: 'Bundle not found' });
    }
    res.json(bundle);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete bundle (Admin only)
router.delete('/:id', authenticate, isAdmin, async (req, res) => {
  try {
    const bundle = await Bundle.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    if (!bundle) {
      return res.status(404).json({ message: 'Bundle not found' });
    }
    res.json({ message: 'Bundle deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

