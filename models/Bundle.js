import mongoose from 'mongoose';

const bundleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  services: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: true
  }],
  addons: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Addon'
  }],
  discountType: {
    type: String,
    enum: ['percentage', 'fixed'],
    required: true
  },
  discountValue: {
    type: Number,
    required: true,
    min: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export default mongoose.model('Bundle', bundleSchema);

