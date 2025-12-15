import express from 'express';
import Quotation from '../models/Quotation.js';
import Service from '../models/Service.js';
import Addon from '../models/Addon.js';
import Bundle from '../models/Bundle.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Calculate pricing logic
const calculatePricing = async (items, bundles = []) => {
  let subtotal = 0;
  let discount = 0;

  // Calculate items subtotal
  for (const item of items) {
    const service = await Service.findById(item.service);
    if (!service) continue;

    let itemPrice = service.basePrice * (item.quantity || 1);
    
    // Add addon prices
    if (item.addons && item.addons.length > 0) {
      const addons = await Addon.find({ _id: { $in: item.addons } });
      addons.forEach(addon => {
        itemPrice += addon.price;
      });
    }

    subtotal += itemPrice;
  }

  // Calculate bundle discounts
  if (bundles.length > 0) {
    const bundleDocs = await Bundle.find({ _id: { $in: bundles }, isActive: true })
      .populate('services');
    
    for (const bundle of bundleDocs) {
      const bundleServices = bundle.services.map(s => s._id.toString());
      const selectedServiceIds = items.map(item => item.service.toString());
      
      // Check if all bundle services are selected
      const hasAllServices = bundle.services.every(service => 
        selectedServiceIds.includes(service._id.toString())
      );

      if (hasAllServices) {
        let bundlePrice = 0;
        bundle.services.forEach(service => {
          bundlePrice += service.basePrice;
        });

        if (bundle.discountType === 'percentage') {
          discount += (bundlePrice * bundle.discountValue) / 100;
        } else {
          discount += bundle.discountValue;
        }
      }
    }
  }

  const total = Math.max(0, subtotal - discount);

  return { subtotal, discount, total };
};

// Create quotation
router.post('/', authenticate, async (req, res) => {
  try {
    const { clientName, clientEmail, clientPhone, items, bundles, notes } = req.body;

    // Process items and calculate prices
    const processedItems = [];
    for (const item of items) {
      const service = await Service.findById(item.service);
      if (!service) continue;

      let itemPrice = service.basePrice * (item.quantity || 1);
      
      // Add addon prices
      if (item.addons && item.addons.length > 0) {
        const addons = await Addon.find({ _id: { $in: item.addons } });
        addons.forEach(addon => {
          itemPrice += addon.price;
        });
      }

      processedItems.push({
        service: item.service,
        addons: item.addons || [],
        quantity: item.quantity || 1,
        price: itemPrice
      });
    }

    // Calculate pricing
    const { subtotal, discount, total } = await calculatePricing(processedItems, bundles || []);

    const quotation = new Quotation({
      clientName,
      clientEmail,
      clientPhone,
      items: processedItems,
      bundles: bundles || [],
      subtotal,
      discount,
      total,
      notes,
      createdBy: req.user._id,
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
    });

    await quotation.save();
    const populated = await Quotation.findById(quotation._id)
      .populate('items.service')
      .populate('items.addons')
      .populate('bundles')
      .populate('createdBy', 'name email');

    res.status(201).json(populated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all quotations
router.get('/', authenticate, async (req, res) => {
  try {
    const query = req.user.role === 'admin' 
      ? {} 
      : { createdBy: req.user._id };
    
    const quotations = await Quotation.find(query)
      .populate('items.service')
      .populate('items.addons')
      .populate('bundles')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });
    
    res.json(quotations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get quotation by ID
router.get('/:id', authenticate, async (req, res) => {
  try {
    const quotation = await Quotation.findById(req.params.id)
      .populate('items.service')
      .populate('items.addons')
      .populate('bundles')
      .populate('createdBy', 'name email');
    
    if (!quotation) {
      return res.status(404).json({ message: 'Quotation not found' });
    }

    // Check access
    if (req.user.role !== 'admin' && quotation.createdBy._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(quotation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update quotation status
router.patch('/:id/status', authenticate, async (req, res) => {
  try {
    const { status } = req.body;
    const quotation = await Quotation.findById(req.params.id);
    
    if (!quotation) {
      return res.status(404).json({ message: 'Quotation not found' });
    }

    if (req.user.role !== 'admin' && quotation.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    quotation.status = status;
    await quotation.save();

    res.json(quotation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;

