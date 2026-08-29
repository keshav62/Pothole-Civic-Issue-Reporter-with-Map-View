import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { getWorkerTasks } from '../src/controllers/workerController.js';
import { authorizeRoles } from '../src/middleware/roleMiddleware.js';
import User from '../src/models/User.js';
import Issue from '../src/models/Issue.js';

dotenv.config();

// Simple Express Mock
const mockRes = () => {
  const res = {};
  res.status = (code) => { res.statusCode = code; return res; };
  res.json = (data) => { res.body = data; return res; };
  return res;
};

async function runSecurityTest() {
  console.log('--- STARTING FIELD WORKER SECURITY TEST ---\n');
  
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/civicconnect');

  // 1. Setup Test Users
  const workerA = await User.create({ firebaseUid: 'UID_A', name: 'Worker A', email: 'workera@test.com', role: 'FIELD_WORKER' });
  const workerB = await User.create({ firebaseUid: 'UID_B', name: 'Worker B', email: 'workerb@test.com', role: 'FIELD_WORKER' });
  const citizen = await User.create({ firebaseUid: 'UID_C', name: 'Citizen C', email: 'citizen@test.com', role: 'CITIZEN' });
  const admin = await User.create({ firebaseUid: 'UID_D', name: 'Admin D', email: 'admin@test.com', role: 'SUPER_ADMIN' });

  // 2. Setup Test Issues
  await Issue.create({ title: 'Task A1', description: 'desc', category: 'POTHOLE', location: { coordinates: [77, 28] }, reportedBy: citizen._id, assignedWorker: workerA._id });
  await Issue.create({ title: 'Task A2', description: 'desc', category: 'POTHOLE', location: { coordinates: [77, 28] }, reportedBy: citizen._id, assignedWorker: workerA._id });
  await Issue.create({ title: 'Task B1', description: 'desc', category: 'POTHOLE', location: { coordinates: [77, 28] }, reportedBy: citizen._id, assignedWorker: workerB._id });
  await Issue.create({ title: 'Unassigned Task', description: 'desc', category: 'POTHOLE', location: { coordinates: [77, 28] }, reportedBy: citizen._id });

  // 3. Test Function
  const testAccess = async (user, description, expectedStatus) => {
    console.log(`[TEST]: ${description}`);
    const req = { user, query: {} };
    const res = mockRes();
    
    // Step 1: Role Authorization
    let nextCalled = false;
    const authMiddleware = authorizeRoles('FIELD_WORKER');
    authMiddleware(req, res, () => { nextCalled = true; });

    if (!nextCalled) {
      console.log(`   -> BLOCKED BY MIDDLEWARE (HTTP ${res.statusCode}): ${res.body.message}\n`);
      return;
    }

    // Step 2: Controller Execution
    await getWorkerTasks(req, res, (err) => { res.statusCode = 500; res.body = err; });
    
    console.log(`   -> ALLOWED (HTTP ${res.statusCode})`);
    if (res.body.data && res.body.data.tasks) {
      const taskTitles = res.body.data.tasks.map(t => t.title);
      console.log(`   -> Tasks visible: ${taskTitles.length ? taskTitles.join(', ') : 'None'}\n`);
    }
  };

  // 4. Run Scenarios
  await testAccess(workerA, 'Worker A fetching tasks', 200);
  await testAccess(workerB, 'Worker B fetching tasks', 200);
  await testAccess(citizen, 'Citizen token fetching tasks', 403);
  await testAccess(admin, 'Admin token fetching tasks', 403);

  // 5. Cleanup
  await User.deleteMany({ _id: { $in: [workerA._id, workerB._id, citizen._id, admin._id] } });
  await Issue.deleteMany({ reportedBy: citizen._id });
  
  await mongoose.disconnect();
  console.log('--- SECURITY TEST COMPLETE ---');
}

runSecurityTest().catch(console.error);
