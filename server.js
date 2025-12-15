import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import serviceRoutes from './routes/services.js';
import addonRoutes from './routes/addons.js';
import bundleRoutes from './routes/bundles.js';
import quotationRoutes from './routes/quotations.js';
import adminRoutes from './routes/admin.js';
import pdfRoutes from './routes/pdf.js';

dotenv.config();

// Check for required environment variables
if (!process.env.JWT_SECRET) {
  console.error('❌ ERROR: JWT_SECRET is not set in .env file!');
  console.error('Please create a .env file in the Backend folder with:');
  console.error('JWT_SECRET=your_secret_key_here');
  process.exit(1);
}

const app = express();

// Middleware - CORS Configuration
const corsOptions = {
  origin: [
    'https://quotation-generator-murex.vercel.app',
    'http://localhost:5173',
    'http://localhost:3000',
    'http://localhost:5174'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/addons', addonRoutes);
app.use('/api/bundles', bundleRoutes);
app.use('/api/quotations', quotationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/pdf', pdfRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'NexLead API is running' });
});

// MongoDB Connection
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI ;

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connected successfully');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  });

export default app;

