import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Service from '../models/Service.js';
import Addon from '../models/Addon.js';
import Bundle from '../models/Bundle.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://acursor96_db_user:x3ELOXMYxoyQkEls@cluster0.tv742mt.mongodb.net/?appName=Cluster0';

const seedData = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Service.deleteMany({});
    await Addon.deleteMany({});
    await Bundle.deleteMany({});

    // Create Admin User
    const admin = new User({
      name: 'Admin User',
      email: 'admin@nexlead.com',
      password: 'admin123',
      role: 'admin',
    });
    await admin.save();
    console.log('✅ Created admin user (admin@nexlead.com / admin123)');

    // Create Sales Agent
    const agent = new User({
      name: 'Sales Agent',
      email: 'agent@nexlead.com',
      password: 'agent123',
      role: 'sales-agent',
    });
    await agent.save();
    console.log('✅ Created sales agent (agent@nexlead.com / agent123)');

    // Create Services
    const services = [
      {
        name: 'Basic Website',
        category: 'Website Development',
        description: 'Professional basic website with up to 5 pages',
        basePrice: 999,
        type: 'one-time',
      },
      {
        name: 'Advanced Website',
        category: 'Website Development',
        description: 'Advanced website with custom features and CMS',
        basePrice: 2499,
        type: 'one-time',
      },
      {
        name: 'IDX Integration',
        category: 'Website Development',
        description: 'Real estate IDX integration for property listings',
        basePrice: 1499,
        type: 'one-time',
      },
      {
        name: 'Full-time VA',
        category: 'Virtual Assistant Services',
        description: 'Full-time virtual assistant (40 hours/week)',
        basePrice: 1200,
        type: 'monthly',
      },
      {
        name: 'Part-time VA',
        category: 'Virtual Assistant Services',
        description: 'Part-time virtual assistant (20 hours/week)',
        basePrice: 600,
        type: 'monthly',
      },
      {
        name: 'Content Creation',
        category: 'Social Media Marketing',
        description: 'Monthly social media content creation',
        basePrice: 500,
        type: 'monthly',
      },
      {
        name: 'Ad Campaigns',
        category: 'Social Media Marketing',
        description: 'Social media advertising campaigns management',
        basePrice: 800,
        type: 'monthly',
      },
      {
        name: 'Logo Design',
        category: 'Branded Kit',
        description: 'Professional logo design',
        basePrice: 299,
        type: 'one-time',
      },
      {
        name: 'Brand Guidelines',
        category: 'Branded Kit',
        description: 'Complete brand guidelines document',
        basePrice: 499,
        type: 'one-time',
      },
      {
        name: 'Collateral Templates',
        category: 'Branded Kit',
        description: 'Business cards, letterheads, and marketing collateral templates',
        basePrice: 399,
        type: 'one-time',
      },
      {
        name: 'NexLead CRM Setup',
        category: 'CRM Services',
        description: 'Complete CRM setup and configuration',
        basePrice: 999,
        type: 'one-time',
      },
      {
        name: 'Lead Automation',
        category: 'CRM Services',
        description: 'Automated lead management system',
        basePrice: 299,
        type: 'monthly',
      },
      {
        name: 'Pipeline Management',
        category: 'CRM Services',
        description: 'Sales pipeline management and tracking',
        basePrice: 199,
        type: 'monthly',
      },
    ];

    const createdServices = await Service.insertMany(services);
    console.log(`✅ Created ${createdServices.length} services`);

    // Create Add-ons
    const addons = [
      {
        name: 'SEO Optimization',
        category: 'Website Development',
        description: 'Basic SEO optimization',
        price: 299,
        type: 'one-time',
      },
      {
        name: 'SSL Certificate',
        category: 'Website Development',
        description: 'SSL certificate installation',
        price: 99,
        type: 'one-time',
      },
      {
        name: 'Email Marketing',
        category: 'Social Media Marketing',
        description: 'Email marketing campaigns',
        price: 200,
        type: 'monthly',
      },
      {
        name: 'Video Editing',
        category: 'Social Media Marketing',
        description: 'Social media video editing',
        price: 300,
        type: 'monthly',
      },
    ];

    const createdAddons = await Addon.insertMany(addons);
    console.log(`✅ Created ${createdAddons.length} add-ons`);

    // Create Bundle - All-in-One Solution
    // Select key services: Basic Website, Full-time VA, Content Creation, NexLead CRM Setup
    const allInOneBundle = new Bundle({
      name: 'All-in-One Solution',
      description: 'Complete real estate solution package with website, VA, marketing, and CRM',
      services: [
        createdServices[0]._id, // Basic Website
        createdServices[3]._id,   // Full-time VA
        createdServices[5]._id,   // Content Creation
        createdServices[10]._id  // NexLead CRM Setup
      ],
      discountType: 'percentage',
      discountValue: 15,
    });
    await allInOneBundle.save();
    console.log('✅ Created All-in-One bundle with 15% discount');

    console.log('\n🎉 Seed data created successfully!');
    console.log('\nLogin credentials:');
    console.log('Admin: admin@nexlead.com / admin123');
    console.log('Agent: agent@nexlead.com / agent123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
};

seedData();

