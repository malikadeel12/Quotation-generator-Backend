import express from 'express';
import Quotation from '../models/Quotation.js';
import Service from '../models/Service.js';
import User from '../models/User.js';
import { authenticate, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// All routes require admin
router.use(authenticate);
router.use(isAdmin);

// Analytics Dashboard
router.get('/analytics', async (req, res) => {
  try {
    const totalQuotations = await Quotation.countDocuments();
    
    // Calculate total revenue - sum all quotation totals
    const totalRevenueResult = await Quotation.aggregate([
      {
        $match: {
          total: { $exists: true, $ne: null, $type: 'number' }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: { $ifNull: ['$total', 0] } }
        }
      }
    ]);
    
    const totalRevenue = totalRevenueResult[0]?.total || 0;

    // Most selected services
    const popularServices = await Quotation.aggregate([
      { $unwind: '$items' },
      { $group: { _id: '$items.service', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
      { $lookup: { from: 'services', localField: '_id', foreignField: '_id', as: 'service' } },
      { $unwind: '$service' },
      { $project: { name: '$service.name', count: 1 } }
    ]);

    // Quotations by agent
    const byAgent = await Quotation.aggregate([
      { $group: { _id: '$createdBy', count: { $sum: 1 }, revenue: { $sum: '$total' } } },
      { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'user' } },
      { $unwind: '$user' },
      { $project: { agentName: '$user.name', count: 1, revenue: 1 } }
    ]);

    // Recent quotations
    const recentQuotations = await Quotation.find()
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .limit(10)
      .select('quotationNumber clientName total status createdAt');

    res.json({
      totalQuotations,
      totalRevenue: totalRevenue,
      popularServices,
      byAgent,
      recentQuotations
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create admin user
router.post('/users', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const user = new User({ name, email, password, role: role || 'sales-agent' });
    await user.save();
    res.status(201).json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;

