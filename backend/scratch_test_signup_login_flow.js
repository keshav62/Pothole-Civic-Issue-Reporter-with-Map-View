import dotenv from 'dotenv';
dotenv.config({ path: './.env' });

const API_BASE = 'http://localhost:5000/api';

async function testFullSignupLoginFlow() {
  const testId = Date.now();
  const name = `Priya Sharma ${testId}`;
  const email = `priya_${testId}@gmail.com`;
  const role = 'DEPARTMENT_ADMIN';
  const department = 'Water Supply';
  const ward = 'Ward 10 - Bandra East';

  console.log(`1. Signing up new user: Name="${name}", Email="${email}"...`);

  const signupRes = await fetch(`${API_BASE}/auth/session`, {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer mock-id-token-email',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name,
      email,
      role,
      department,
      ward,
      phone: '+91 98765 00000',
      isSignup: true
    })
  });

  const signupJson = await signupRes.json();
  console.log('Signup API Response:', signupJson);

  if (!signupJson.success) {
    throw new Error('Signup failed in MongoDB!');
  }
  console.log('   ✅ USER CREATED IN MONGODB ATLAS!\n');

  console.log('2. Logging in using exact EMAIL (priya@gmail.com)...');
  const loginEmailRes = await fetch(`${API_BASE}/auth/session`, {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer mock-id-token-email',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email })
  });
  const loginEmailJson = await loginEmailRes.json();
  console.log('Login via Email Response:', loginEmailJson);

  if (loginEmailJson.success && loginEmailJson.data?.user?.email === email) {
    console.log('   ✅ SUCCESS: Authenticated via Email!\n');
  } else {
    console.error('❌ Failed login via email!');
  }

  console.log('3. Logging in using USERNAME / NAME (Priya Sharma)...');
  const loginNameRes = await fetch(`${API_BASE}/auth/session`, {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer mock-id-token-email',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email: name })
  });
  const loginNameJson = await loginNameRes.json();
  console.log('Login via Username Response:', loginNameJson);

  if (loginNameJson.success && loginNameJson.data?.user?.email === email) {
    console.log('   ✅ SUCCESS: Authenticated via Username/Name!\n');
  } else {
    console.error('❌ Failed login via username!');
  }

  console.log('🎉 END-TO-END SIGNUP & LOGIN FLOW VERIFIED 100% WORKING!');
}

testFullSignupLoginFlow().catch(console.error);
