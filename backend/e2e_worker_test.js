import mongoose from 'mongoose';
import dotenv from 'dotenv';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';
import admin from 'firebase-admin';

// Load env
dotenv.config();

// Create a dummy image for testing
const dummyImgPath = path.join(process.cwd(), 'dummy_test.jpg');
fs.writeFileSync(dummyImgPath, 'dummy image content for e2e test');

const runTest = async () => {
  try {
    console.log('--- STARTING E2E FIELD WORKER TEST ---');
    
    // 1. Connect to MongoDB directly to setup data
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/civicconnect');
    
    // Import models
    const User = (await import('./src/models/User.js')).default;
    const Issue = (await import('./src/models/Issue.js')).default;
    const IssueHistory = (await import('./src/models/IssueHistory.js')).default;

    // 2. Setup Firebase Admin
    console.log('Initializing Firebase Admin...');
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });

    // 3. Find or Create Test Worker
    let worker = await User.findOne({ email: 'e2e_worker@test.com' });
    let firebaseUid;
    
    if (!worker) {
      console.log('Creating new test worker in Firebase...');
      const fbUser = await admin.auth().createUser({
        email: 'e2e_worker@test.com',
        password: 'password123',
        displayName: 'E2E Worker'
      });
      firebaseUid = fbUser.uid;
      
      console.log('Creating new test worker in MongoDB...');
      worker = await User.create({
        firebaseUid,
        email: 'e2e_worker@test.com',
        name: 'E2E Worker',
        role: 'FIELD_WORKER',
        department: 'Roads & Bridges',
        ward: 'Ward 10'
      });
    } else {
      firebaseUid = worker.firebaseUid;
    }
    
    // 4. Generate a Firebase Custom Token and swap for ID Token
    console.log('Generating custom token...');
    const customToken = await admin.auth().createCustomToken(firebaseUid);
    
    console.log('Swapping custom token for ID token via Google REST API...');
    const apiKey = process.env.VITE_FIREBASE_API_KEY || process.env.FIREBASE_API_KEY;
    if (!apiKey) {
      throw new Error('Missing FIREBASE_API_KEY in backend .env to swap token. Make sure it is exported or available.');
    }
    const tokenSwapRes = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token: customToken,
        returnSecureToken: true
      })
    });
    
    if (!tokenSwapRes.ok) {
      const errTxt = await tokenSwapRes.text();
      throw new Error('Failed to swap token: ' + errTxt);
    }
    const tokenSwapData = await tokenSwapRes.json();
    const idToken = tokenSwapData.idToken;
    console.log('Successfully acquired Firebase ID Token!');

    const apiFetch = async (endpoint, options = {}) => {
      const url = `http://localhost:5000${endpoint}`;
      const headers = {
        'Authorization': `Bearer ${idToken}`,
        ...(options.headers || {})
      };
      if (options.body && !(options.body instanceof FormData) && !headers['Content-Type']) {
        headers['Content-Type'] = 'application/json';
      }
      
      const res = await fetch(url, { ...options, headers });
      if (!res.ok) {
        let err;
        try { err = await res.json(); } catch { err = await res.text(); }
        throw { status: res.status, data: err };
      }
      return res.json();
    };

    // 5. Create a test Issue directly via MongoDB (to simulate Admin assigning it)
    console.log('Creating test issue...');
    const issue = await Issue.create({
      title: 'E2E Test Pothole',
      description: 'Massive pothole causing traffic',
      category: 'Road',
      priority: 'HIGH',
      status: 'ASSIGNED',
      assignedWorker: worker._id,
      location: {
        type: 'Point',
        coordinates: [72.8710, 19.1145]
      },
      address: 'Test Road, Mumbai',
      images: ['http://dummy.url/img.jpg'],
      slaHours: 48
    });
    
    // Also create the initial ASSIGNED history log just like issueService does
    await IssueHistory.create({
      issue: issue._id,
      action: 'WORKER_ASSIGNED',
      oldStatus: 'VERIFIED',
      newStatus: 'ASSIGNED',
      performedBy: worker._id
    });
    console.log(`Created Issue ${issue._id}`);

    // --- EXECUTE WORKFLOW API TESTS ---
    
    // A. Profile
    console.log('\\n[TEST] GET /api/workers/me');
    const profileRes = await apiFetch('/api/workers/me');
    console.log('Profile Stats:', profileRes.data.stats);

    // B. List Tasks
    console.log('\\n[TEST] GET /api/workers/me/tasks');
    const tasksRes = await apiFetch('/api/workers/me/tasks');
    console.log(`Found ${tasksRes.data.tasks.length} tasks.`);
    
    // C. Accept Task
    console.log(`\\n[TEST] PATCH /api/workers/tasks/${issue._id}/accept`);
    const acceptRes = await apiFetch(`/api/workers/tasks/${issue._id}/accept`, { 
      method: 'PATCH', 
      body: JSON.stringify({ note: 'Accepting e2e task' }) 
    });
    console.log('Status after accept:', acceptRes.data.task.status);
    
    // D. Start Task
    console.log(`\\n[TEST] PATCH /api/workers/tasks/${issue._id}/start`);
    const startRes = await apiFetch(`/api/workers/tasks/${issue._id}/start`, { 
      method: 'PATCH', 
      body: JSON.stringify({ note: 'Starting e2e task' }) 
    });
    console.log('Status after start:', startRes.data.task.status);

    // E. Upload Proof & Complete Task
    console.log(`\\n[TEST] POST /api/workers/tasks/${issue._id}/proof`);
    const form = new FormData();
    form.append('beforeImages', fs.createReadStream(dummyImgPath));
    form.append('afterImages', fs.createReadStream(dummyImgPath));
    form.append('repairNote', 'E2E repair completed');
    
    const proofRes = await apiFetch(`/api/workers/tasks/${issue._id}/proof`, {
      method: 'POST',
      body: form,
      headers: form.getHeaders()
    });
    console.log('Status after proof:', proofRes.data.task.status);
    
    // F. Verify MongoDB IssueHistory
    console.log('\\n[TEST] Verifying IssueHistory in MongoDB...');
    const history = await IssueHistory.find({ issue: issue._id }).sort({ createdAt: 1 });
    history.forEach(h => {
      console.log(`- ${h.action}: ${h.oldStatus} -> ${h.newStatus} (Note: ${h.note || 'none'})`);
    });

    if (history.length >= 4) {
      console.log('\\n✅ ALL TESTS PASSED SUCCESSFULLY!');
    } else {
      console.log('\\n❌ Missing history records.');
    }

  } catch (error) {
    console.error('\\n❌ TEST FAILED');
    if (error.status) {
      console.error('API Response Error:', error.status, error.data);
    } else {
      console.error(error);
    }
  } finally {
    if (fs.existsSync(dummyImgPath)) fs.unlinkSync(dummyImgPath);
    await mongoose.disconnect();
    process.exit(0);
  }
};

runTest();
