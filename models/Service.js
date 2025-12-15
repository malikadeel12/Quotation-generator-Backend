import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: [
      'Website Development',
      'Virtual Assistant Services',
      'Social Media Marketing',
      'Branded Kit',
      'CRM Services',
      'All-in-One Solution'
    ]
  },
  description: {
    type: String,
    default: ''
  },
  basePrice: {
    type: Number,
    required: true,
    min: 0
  },
  type: {
    type: String,
    enum: ['one-time', 'monthly'],
    required: true
  },
  addons: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Addon'
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  icon: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

export default mongoose.model('Service', serviceSchema);

