import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import { seedDatabase } from './seedData.js';

dotenv.config();

const run = async () => {
  await connectDB();
  console.log('🧹 Clearing existing data & seeding...');
  const result = await seedDatabase();

  console.log(`\n✅ Seed complete: ${result.properties} properties, ${result.agents} agents, ${result.users} demo user`);
  console.log('\n🔑 Login credentials (password for all: password123):');
  console.log('   Agent : imran@estatley.pk');
  console.log('   Agent : ayesha@estatley.pk');
  console.log('   Agent : bilal@estatley.pk');
  console.log('   User  : user@estatley.pk\n');

  await mongoose.connection.close();
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
