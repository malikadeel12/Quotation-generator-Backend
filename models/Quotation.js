import mongoose from 'mongoose';

const quotationItemSchema = new mongoose.Schema({
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: true
  },
  addons: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Addon'
  }],
  quantity: {
    type: Number,
    default: 1
  },
  price: {
    type: Number,
    required: true
  }
});

const quotationSchema = new mongoose.Schema({
  quotationNumber: {
    type: String,
    unique: true,
    required: true
  },
  clientName: {
    type: String,
    required: true,
    trim: true
  },
  clientEmail: {
    type: String,
    trim: true
  },
  clientPhone: {
    type: String,
    trim: true
  },
  items: [quotationItemSchema],
  bundles: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bundle'
  }],
  subtotal: {
    type: Number,
    required: true,
    min: 0
  },
  discount: {
    type: Number,
    default: 0,
    min: 0
  },
  total: {
    type: Number,
    required: true,
    min: 0
  },
  notes: {
    type: String,
    default: ''
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['draft', 'sent', 'accepted', 'rejected'],
    default: 'draft'
  },
  validUntil: {
    type: Date
  }
}, {
  timestamps: true
});

// Generate quotation number before validation
quotationSchema.pre('validate', async function(next) {
  if (!this.quotationNumber) {
    try {
      const count = await mongoose.model('Quotation').countDocuments();
      this.quotationNumber = `NEX-${Date.now()}-${count + 1}`;
    } catch (error) {
      // Fallback if count fails
      this.quotationNumber = `NEX-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    }
  }
  next();
});

export default mongoose.model('Quotation', quotationSchema);

