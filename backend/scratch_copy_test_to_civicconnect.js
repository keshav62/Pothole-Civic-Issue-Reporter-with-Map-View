import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: './.env' });

async function copyDataToCivicConnectDb() {
  console.log('1. Connecting to MongoDB cluster...');
  const conn = await mongoose.connect(process.env.MONGO_URI);
  const srcDb = conn.connection.useDb('test');
  const targetDb = conn.connection.useDb('civicconnect');

  const collections = ['users', 'issues', 'issuehistories', 'notifications', 'departments'];

  for (const colName of collections) {
    const srcDocs = await srcDb.collection(colName).find().toArray();
    if (srcDocs.length > 0) {
      console.log(`Copying ${srcDocs.length} documents for '${colName}' into 'civicconnect' database...`);
      await targetDb.collection(colName).deleteMany({});
      await targetDb.collection(colName).insertMany(srcDocs);
    }
  }

  console.log('\n✅ Data successfully copied into database "civicconnect"!');
  await mongoose.disconnect();
}

copyDataToCivicConnectDb().catch(console.error);
