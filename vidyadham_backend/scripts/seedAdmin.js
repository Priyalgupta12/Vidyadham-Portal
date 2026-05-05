import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Admin from '../models/Admin.js';

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ role: 'admin' });

    if (existingAdmin) {
      // Update existing admin credentials
      existingAdmin.email = process.env.ADMIN_EMAIL;
      existingAdmin.password = process.env.ADMIN_PASSWORD;
      await existingAdmin.save();
      console.log('✅ Admin credentials updated successfully');
      console.log(`   Email: ${process.env.ADMIN_EMAIL}`);
    } else {
      // Create new admin
      await Admin.create({
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
        role: 'admin',
      });
      console.log('✅ Admin user created successfully');
      console.log(`   Email: ${process.env.ADMIN_EMAIL}`);
    }

    // Ensure only one admin exists
    const adminCount = await Admin.countDocuments({ role: 'admin' });
    console.log(`   Total admin accounts: ${adminCount}`);

    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error.message);
    process.exit(1);
  }
};

seedAdmin();
