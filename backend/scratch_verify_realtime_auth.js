import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import dotenv from 'dotenv';

dotenv.config({ path: './.env' });

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

async function testRealtimeSignupLogin() {
  const uid = `real-user-${Date.now()}`;
  const email = `realuser_${Date.now()}@civicconnect.org`;
  const name = 'Rajesh Kumar';
  const role = 'DEPARTMENT_ADMIN';
  const department = 'Road Maintenance';
  const ward = 'Ward 18 - Bandra West';
  const phone = '+91 98200 12345';

  console.log('1. Creating account in Firebase Auth...');
  await adminAuth.createUser({ uid, email, displayName: name });

  const customToken = await adminAuth.createCustomToken(uid);
  const tokenRes = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=${WEB_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token: customToken, returnSecureToken: true })
  });

  const tokenData = await tokenRes.json();
  const idToken = tokenData.idToken;

  console.log('2. Calling POST /api/auth/session with registration profile parameters...');
  const signupSessionRes = await fetch(`${API_BASE}/auth/session`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${idToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name, role, department, ward, phone })
  });

  const signupJson = await signupSessionRes.json();
  console.log('Signup Session Response:', signupJson);

  if (!signupJson.success) {
    throw new Error(`Signup session failed: ${JSON.stringify(signupJson)}`);
  }

  const createdUser = signupJson.data.user;
  console.log(`   ✅ User saved to MongoDB! ID=${createdUser.id}, Name=${createdUser.name}, Role=${createdUser.role}, Dept=${createdUser.department}, Ward=${createdUser.ward}`);

  console.log('3. Simulating subsequent user Login (fetching stored profile from MongoDB)...');
  const loginSessionRes = await fetch(`${API_BASE}/auth/session`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${idToken}`,
      'Content-Type': 'application/json'
    }
  });

  const loginJson = await loginSessionRes.json();
  const fetchedUser = loginJson.data.user;

  console.log(`   ✅ User logged in & fetched from MongoDB! Name=${fetchedUser.name}, Role=${fetchedUser.role}, Dept=${fetchedUser.department}`);

  if (fetchedUser.role === role && fetchedUser.name === name) {
    console.log('\n🎉 REAL-TIME DATABASE SIGNUP & LOGIN VERIFIED SUCCESSFULLY!');
  } else {
    console.error('❌ Mismatch in user profile data fetched on login!');
  }
}

testRealtimeSignupLogin().catch(console.error);
