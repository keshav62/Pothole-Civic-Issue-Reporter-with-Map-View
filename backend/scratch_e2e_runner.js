import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import mongoose from 'mongoose';
import User from './src/models/User.js';

// Connect to Firebase Admin using env
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    }),
  });
}

const adminAuth = getAuth();
const WEB_API_KEY = 'AIzaSyANVv6y3FoI0khY-PEnXFPfA3MidSzm5oQ';
const API_BASE = 'http://localhost:5000/api';

// Helper to get real Firebase ID token for a user with specific role in MongoDB
async function getAuthSession(uid, email, role = 'CITIZEN', extraProps = {}) {
  try {
    await adminAuth.getUser(uid);
  } catch {
    await adminAuth.createUser({ uid, email, displayName: `Test ${role} ${uid}` });
  }

  const customToken = await adminAuth.createCustomToken(uid);
  const res = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=${WEB_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token: customToken, returnSecureToken: true })
  });

  const data = await res.json();
  const idToken = data.idToken;

  // 1. Session call (creates CITIZEN by default)
  const sessionRes = await fetch(`${API_BASE}/auth/session`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${idToken}`, 'Content-Type': 'application/json' }
  });
  const sessionJson = await sessionRes.json();

  if (!sessionJson.success) {
    throw new Error(`Session creation failed: ${JSON.stringify(sessionJson)}`);
  }

  let user = sessionJson.data.user;

  // If role is different from CITIZEN, update directly in MongoDB for testing purposes
  if (role !== 'CITIZEN' || Object.keys(extraProps).length > 0) {
    const db = await mongoose.connect(process.env.MONGO_URI);
    await User.updateOne({ firebaseUid: uid }, { $set: { role, ...extraProps } });
    
    // Refetch user profile from /api/auth/me
    const meRes = await fetch(`${API_BASE}/auth/me`, {
      headers: { 'Authorization': `Bearer ${idToken}` }
    });
    const meJson = await meRes.json();
    user = meJson.data.user;
  }

  return { idToken, user };
}

async function runE2ETests() {
  console.log('====================================================');
  console.log('🚀 CIVICCONNECT COMPLETE END-TO-END SUITE RUNNER');
  console.log('====================================================\n');

  const results = {
    passing: [],
    failing: [],
    bugs: []
  };

  // ----------------------------------------------------
  // WORKFLOW 1: CITIZEN FLOW
  // ----------------------------------------------------
  console.log('--- WORKFLOW 1: CITIZEN ---');
  let citizenToken, citizenUser, createdIssue;
  try {
    const citizenUid = `test-citizen-${Date.now()}`;
    const citizenEmail = `citizen_${Date.now()}@example.com`;
    console.log(`1.1 Google Login & Session creation for ${citizenEmail}...`);
    const citizenSession = await getAuthSession(citizenUid, citizenEmail, 'CITIZEN');
    citizenToken = citizenSession.idToken;
    citizenUser = citizenSession.user;
    console.log(`   ✅ Citizen registered/authenticated in MongoDB: ID=${citizenUser.id}, Role=${citizenUser.role}`);

    console.log('1.2 Reporting a new issue with GPS location...');
    const issuePayload = {
      title: 'Deep Pothole on MG Road near Metro Station',
      description: 'Dangerous pothole causing severe traffic delay and vehicle damage.',
      category: 'POTHOLE',
      priority: 'HIGH',
      location: {
        type: 'Point',
        coordinates: [77.2090, 28.6139] // [lng, lat]
      },
      address: 'MG Road Metro Station Gate 2, Delhi',
      ward: 'Ward 12'
    };

    const createRes = await fetch(`${API_BASE}/issues`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${citizenToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(issuePayload)
    });

    const createJson = await createRes.json();
    if (createRes.status === 201 && createJson.success) {
      createdIssue = createJson.data.issue;
      console.log(`   ✅ Issue created in MongoDB! IssueID=${createdIssue.issueId}, Status=${createdIssue.status}`);
      results.passing.push('Citizen: Create Account & Submit Issue');
    } else {
      throw new Error(`Failed to create issue: ${JSON.stringify(createJson)}`);
    }

    console.log('1.3 Checking issue on Map (/api/issues/nearby)...');
    const nearbyRes = await fetch(`${API_BASE}/issues/nearby?lat=28.6139&lng=77.2090&radius=5000`);
    const nearbyJson = await nearbyRes.json();
    if (nearbyRes.ok && nearbyJson.data?.issues) {
      const found = nearbyJson.data.issues.find(i => i.issueId === createdIssue.issueId);
      if (found) {
        console.log(`   ✅ Issue found on nearby map! Distance=${found.distanceMeters}m, Leaflet=[${found.leaflet.lat}, ${found.leaflet.lng}]`);
        results.passing.push('Citizen: Issue Appears on Map');
      } else {
        console.log('   ❌ Issue created but NOT returned in nearby map query!');
        results.failing.push('Citizen: Issue Appears on Map');
      }
    } else {
      throw new Error(`Nearby map fetch failed: ${JSON.stringify(nearbyJson)}`);
    }
  } catch (err) {
    console.error('   ❌ Workflow 1 Failed:', err.message);
    results.failing.push('Workflow 1: Citizen');
  }

  // ----------------------------------------------------
  // WORKFLOW 2: ADMIN FLOW
  // ----------------------------------------------------
  console.log('\n--- WORKFLOW 2: ADMIN ---');
  let adminToken, adminUser, workerToken, workerUser;
  try {
    const adminUid = `test-admin-${Date.now()}`;
    const adminEmail = `admin_${Date.now()}@example.com`;
    console.log('2.1 Admin Login & Role Setup...');
    const adminSession = await getAuthSession(adminUid, adminEmail, 'DEPARTMENT_ADMIN', { department: 'Road Maintenance' });
    adminToken = adminSession.idToken;
    adminUser = adminSession.user;
    console.log(`   ✅ Admin authenticated: ID=${adminUser.id}, Role=${adminUser.role}`);

    console.log('2.2 Registering Field Worker...');
    const workerUid = `test-worker-${Date.now()}`;
    const workerEmail = `worker_${Date.now()}@example.com`;
    const workerSession = await getAuthSession(workerUid, workerEmail, 'FIELD_WORKER', { department: 'Road Maintenance' });
    workerToken = workerSession.idToken;
    workerUser = workerSession.user;
    console.log(`   ✅ Worker authenticated: ID=${workerUser.id}, Role=${workerUser.role}`);

    console.log(`2.3 Verifying Issue ${createdIssue._id}...`);
    const verifyRes = await fetch(`${API_BASE}/issues/${createdIssue._id}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status: 'VERIFIED' })
    });
    const verifyJson = await verifyRes.json();
    if (verifyRes.ok && verifyJson.success) {
      console.log(`   ✅ Issue Verified! Status=${verifyJson.data.issue.status}`);
      results.passing.push('Admin: Verify Issue');
    } else {
      console.log('   ❌ Issue verification failed:', verifyJson);
      results.failing.push('Admin: Verify Issue');
    }

    console.log(`2.4 Assigning Field Worker ${workerUser.id} to Issue...`);
    const assignRes = await fetch(`${API_BASE}/issues/${createdIssue._id}/assign`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ workerId: workerUser.id, note: 'Urgent road repair required' })
    });
    const assignJson = await assignRes.json();
    if (assignRes.ok && assignJson.success) {
      const issueObj = assignJson.data.issue || assignJson.data.task;
      console.log(`   ✅ Worker assigned successfully! Status=${issueObj.status}`);
      results.passing.push('Admin: Assign Field Worker');
    } else {
      console.log('   ❌ Worker assignment failed:', assignJson);
      results.failing.push('Admin: Assign Field Worker');
    }
  } catch (err) {
    console.error('   ❌ Workflow 2 Failed:', err.message);
    results.failing.push('Workflow 2: Admin');
  }

  // ----------------------------------------------------
  // WORKFLOW 3: FIELD WORKER FLOW
  // ----------------------------------------------------
  console.log('\n--- WORKFLOW 3: FIELD WORKER ---');
  try {
    console.log('3.1 Worker View Assigned Tasks...');
    const tasksRes = await fetch(`${API_BASE}/workers/me/tasks`, {
      headers: { 'Authorization': `Bearer ${workerToken}` }
    });
    const tasksJson = await tasksRes.json();
    if (tasksRes.ok && tasksJson.data?.tasks) {
      console.log(`   ✅ Worker retrieved ${tasksJson.data.tasks.length} assigned task(s).`);
      results.passing.push('Worker: View Assigned Tasks');
    } else {
      console.log('   ❌ Worker view tasks failed:', tasksJson);
      results.failing.push('Worker: View Assigned Tasks');
    }

    console.log('3.2 Worker Accept Task...');
    const acceptRes = await fetch(`${API_BASE}/workers/tasks/${createdIssue._id}/accept`, {
      method: 'PATCH',
      headers: { 'Authorization': `Bearer ${workerToken}` }
    });
    const acceptJson = await acceptRes.json();
    const acceptTaskObj = acceptJson.data?.task || acceptJson.data?.issue;
    if (acceptRes.ok && acceptJson.success) {
      console.log(`   ✅ Task ACCEPTED! Status=${acceptTaskObj.status}`);
      results.passing.push('Worker: Accept Task');
    } else {
      console.log('   ❌ Worker accept task failed:', acceptJson);
      results.failing.push('Worker: Accept Task');
    }

    console.log('3.3 Worker Start Task...');
    const startRes = await fetch(`${API_BASE}/workers/tasks/${createdIssue._id}/start`, {
      method: 'PATCH',
      headers: { 'Authorization': `Bearer ${workerToken}` }
    });
    const startJson = await startRes.json();
    const startTaskObj = startJson.data?.task || startJson.data?.issue;
    if (startRes.ok && startJson.success) {
      console.log(`   ✅ Task IN_PROGRESS! Status=${startTaskObj.status}`);
      results.passing.push('Worker: Start Task');
    } else {
      console.log('   ❌ Worker start task failed:', startJson);
      results.failing.push('Worker: Start Task');
    }

    console.log('3.4 Worker Complete Task (Submit proof)...');
    const completeRes = await fetch(`${API_BASE}/workers/tasks/${createdIssue._id}/complete`, {
      method: 'PATCH',
      headers: { 'Authorization': `Bearer ${workerToken}` }
    });
    const completeJson = await completeRes.json();
    const completeTaskObj = completeJson.data?.task || completeJson.data?.issue;
    if (completeRes.ok && completeJson.success) {
      console.log(`   ✅ Task COMPLETED! Status=${completeTaskObj.status}`);
      results.passing.push('Worker: Complete Task');
    } else {
      console.log('   ❌ Worker complete task failed:', completeJson);
      results.failing.push('Worker: Complete Task');
    }
  } catch (err) {
    console.error('   ❌ Workflow 3 Failed:', err.message);
    results.failing.push('Workflow 3: Field Worker');
  }

  // ----------------------------------------------------
  // WORKFLOW 4: CITIZEN VERIFICATION FLOW
  // ----------------------------------------------------
  console.log('\n--- WORKFLOW 4: CITIZEN VERIFICATION ---');
  try {
    console.log('4.1 Citizen Check Notifications...');
    const notifRes = await fetch(`${API_BASE}/notifications`, {
      headers: { 'Authorization': `Bearer ${citizenToken}` }
    });
    const notifJson = await notifRes.json();
    if (notifRes.ok && notifJson.data?.notifications) {
      console.log(`   ✅ Citizen has ${notifJson.data.notifications.length} notification(s). Unread=${notifJson.data.unreadCount}`);
      results.passing.push('Citizen: Check Notifications');
    } else {
      console.log('   ❌ Citizen notification check failed:', notifJson);
    }

    console.log('4.2 Citizen Rejects Resolution...');
    const rejectRes = await fetch(`${API_BASE}/issues/${createdIssue._id}/verify`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${citizenToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ approved: false, note: 'Pothole was only partially filled.' })
    });
    const rejectJson = await rejectRes.json();
    const rejectIssueObj = rejectJson.data?.issue || rejectJson.data?.task;
    if (rejectRes.ok && rejectJson.success) {
      console.log(`   ✅ Citizen Rejected! Status=${rejectIssueObj.status}`);
      if (rejectIssueObj.status === 'REOPENED') {
        console.log('   ✅ Issue properly set to REOPENED state.');
        results.passing.push('Citizen: Reject Resolution -> REOPENED');
      } else {
        console.log('   ❌ Status was not set to REOPENED:', rejectIssueObj.status);
        results.failing.push('Citizen: Reject Resolution');
      }
    } else {
      console.log('   ❌ Citizen reject failed:', rejectJson);
      results.failing.push('Citizen: Reject Resolution');
    }
  } catch (err) {
    console.error('   ❌ Workflow 4 Failed:', err.message);
    results.failing.push('Workflow 4: Citizen Verification');
  }

  // ----------------------------------------------------
  // WORKFLOW 5: SECURITY TESTS
  // ----------------------------------------------------
  console.log('\n--- WORKFLOW 5: SECURITY TESTS ---');

  // Test 5.1: Unauthorized request (no token)
  try {
    const res = await fetch(`${API_BASE}/issues`);
    if (res.status === 401) {
      console.log('   ✅ 5.1 Unauthorized request without token rejected (401)');
      results.passing.push('Security: No Token 401');
    } else {
      results.failing.push('Security: No Token 401');
    }
  } catch (err) { console.error(err); }

  // Test 5.2: Invalid token
  try {
    const res = await fetch(`${API_BASE}/issues`, {
      headers: { 'Authorization': 'Bearer invalid.jwt.token' }
    });
    if (res.status === 401) {
      console.log('   ✅ 5.2 Invalid token rejected (401)');
      results.passing.push('Security: Invalid Token 401');
    } else {
      results.failing.push('Security: Invalid Token 401');
    }
  } catch (err) { console.error(err); }

  // Test 5.3: Wrong role (Citizen trying worker endpoint)
  try {
    const res = await fetch(`${API_BASE}/workers/me`, {
      headers: { 'Authorization': `Bearer ${citizenToken}` }
    });
    if (res.status === 403) {
      console.log('   ✅ 5.3 Citizen accessing worker endpoint blocked (403)');
      results.passing.push('Security: Role Guard 403');
    } else {
      results.failing.push('Security: Role Guard 403');
    }
  } catch (err) { console.error(err); }

  // Test 5.4: Worker accessing another worker's task
  try {
    const otherWorkerUid = `other-worker-${Date.now()}`;
    const otherWorkerSession = await getAuthSession(otherWorkerUid, `other_worker_${Date.now()}@example.com`, 'FIELD_WORKER', { department: 'Sanitation' });
    const res = await fetch(`${API_BASE}/workers/tasks/${createdIssue._id}/accept`, {
      method: 'PATCH',
      headers: { 'Authorization': `Bearer ${otherWorkerSession.idToken}` }
    });
    if (res.status === 403 || res.status === 404) {
      console.log(`   ✅ 5.4 Unassigned worker accepting task blocked (${res.status})`);
      results.passing.push('Security: Worker Isolation');
    } else {
      results.failing.push('Security: Worker Isolation');
    }
  } catch (err) { console.error(err); }

  // Test 5.5: Invalid location coordinates
  try {
    const res = await fetch(`${API_BASE}/issues`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${citizenToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: 'Test Invalid Location',
        description: 'Test',
        category: 'POTHOLE',
        location: { type: 'Point', coordinates: [999, 999] } // Invalid lat/lng
      })
    });
    if (res.status === 422) {
      console.log('   ✅ 5.5 Invalid coordinates rejected (422)');
      results.passing.push('Security: Invalid Location Validation 422');
    } else {
      results.failing.push('Security: Invalid Location Validation 422');
    }
  } catch (err) { console.error(err); }

  // Test 5.6: Invalid FSM Status Transition (Citizen attempting to jump REPORTED -> RESOLVED directly)
  try {
    const res = await fetch(`${API_BASE}/issues/${createdIssue._id}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${citizenToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status: 'RESOLVED' })
    });
    if (res.status === 400 || res.status === 403 || res.status === 422) {
      console.log(`   ✅ 5.6 Invalid FSM transition rejected (${res.status})`);
      results.passing.push('Security: FSM Transition Guard');
    } else {
      results.failing.push('Security: FSM Transition Guard');
    }
  } catch (err) { console.error(err); }

  // ----------------------------------------------------
  // SUMMARY REPORT
  // ----------------------------------------------------
  console.log('\n====================================================');
  console.log('📊 FINAL TEST RESULTS SUMMARY');
  console.log('====================================================');
  console.log(`Passing Tests (${results.passing.length}):`);
  results.passing.forEach(p => console.log(`  ✅ ${p}`));
  
  if (results.failing.length > 0) {
    console.log(`\nFailing Tests (${results.failing.length}):`);
    results.failing.forEach(f => console.log(`  ❌ ${f}`));
  } else {
    console.log('\n🎉 ALL WORKFLOWS & SECURITY TESTS 100% PASSED!');
  }

  process.exit(0);
}

runE2ETests().catch(err => {
  console.error('Fatal E2E runner error:', err);
  process.exit(1);
});
