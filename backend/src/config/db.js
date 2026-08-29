import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is not defined in environment variables');
    }

    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // Clean up stale legacy indexes (e.g. clerkId_1) if present in MongoDB collection
    try {
      const db = conn.connection.db;
      const collections = await db.listCollections({ name: 'users' }).toArray();
      if (collections.length > 0) {
        const indexes = await db.collection('users').indexes();
        for (const idx of indexes) {
          if (idx.name.includes('clerkId')) {
            console.log(`Dropping stale MongoDB index: ${idx.name}`);
            await db.collection('users').dropIndex(idx.name);
          }
        }
      }
    } catch (indexErr) {
      console.warn('Index cleanup warning:', indexErr.message);
    }
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};
