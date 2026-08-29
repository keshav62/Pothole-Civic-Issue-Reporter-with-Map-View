import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: './.env' });

async function checkMongoDBUsers() {
  console.log('Connecting to MongoDB Atlas...');
  const conn = await mongoose.connect(process.env.MONGO_URI);
  console.log(`Connected to Host: ${conn.connection.host}`);
  console.log(`Database Name: ${conn.connection.name}\n`);

  const db = conn.connection.db;
  const usersCollection = db.collection('users');

  const count = await usersCollection.countDocuments();
  console.log(`📊 TOTAL USERS STORED IN MONGODB: ${count}\n`);

  console.log('--- RECENTLY REGISTERED USERS IN MONGODB ---');
  const recentUsers = await usersCollection.find().sort({ createdAt: -1 }).limit(10).toArray();

  recentUsers.forEach((u, index) => {
    console.log(`[User ${index + 1}]`);
    console.log(`  ID: ${u._id}`);
    console.log(`  Name: ${u.name}`);
    console.log(`  Email: ${u.email}`);
    console.log(`  Role: ${u.role}`);
    console.log(`  Department: ${u.department || 'N/A'}`);
    console.log(`  Ward: ${u.ward || 'N/A'}`);
    console.log(`  Firebase UID: ${u.firebaseUid}`);
    console.log(`  Created At: ${u.createdAt}`);
    console.log('-------------------------------------------');
  });

  await mongoose.disconnect();
}

checkMongoDBUsers().catch(console.error);
