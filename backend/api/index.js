import app from '../src/app.js';
import { connectDB } from '../src/config/db.js';

// Global variable to maintain the database connection across serverless function invocations
let isDbConnected = false;

export default async (req, res) => {
  if (!isDbConnected) {
    console.log('Initializing database connection for serverless environment...');
    await connectDB();
    isDbConnected = true;
  }
  
  // Pass the request and response to the Express app
  return app(req, res);
};
