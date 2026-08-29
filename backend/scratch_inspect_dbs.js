import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: './.env' });

async function inspectDatabases() {
  const conn = await mongoose.connect(process.env.MONGO_URI);
  const adminDb = conn.connection.db.admin();
  const dbs = await adminDb.listDatabases();
  
  console.log('Databases in your MongoDB Atlas cluster (keshav):');
  console.log(dbs.databases);

  const collections = await conn.connection.db.listCollections().toArray();
  console.log(`\nCollections in current active DB (${conn.connection.name}):`);
  collections.forEach(c => console.log(`  - ${c.name}`));

  await mongoose.disconnect();
}

inspectDatabases().catch(console.error);
