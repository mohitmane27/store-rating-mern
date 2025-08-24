import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './models/User.js';

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const email = process.env.ADMIN_EMAIL;
  const existing = await User.findOne({ email });
  if (existing) {
    console.log('Admin already exists:', email);
  } else {
    const passwordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
    const admin = await User.create({
      name: process.env.ADMIN_NAME,
      email,
      passwordHash,
      address: process.env.ADMIN_ADDRESS,
      role: 'admin'
    });
    console.log('Admin created:', admin.email);
  }
  await mongoose.disconnect();
};

run().catch(err => { console.error(err); process.exit(1); });
