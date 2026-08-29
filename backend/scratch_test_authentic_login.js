import dotenv from 'dotenv';
dotenv.config({ path: './.env' });

const API_BASE = 'http://localhost:5000/api';

async function testAuthenticLogin() {
  console.log('1. Testing authentic login for registered user abc@gmail.com...');
  const registeredRes = await fetch(`${API_BASE}/auth/session`, {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer mock-id-token-email',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email: 'abc@gmail.com' })
  });

  const registeredJson = await registeredRes.json();
  console.log('Registered User Login Response:', registeredJson);
  if (registeredJson.success && registeredJson.data?.user?.email === 'abc@gmail.com') {
    console.log(`   ✅ SUCCESS: Fetched exact registered user! Name=${registeredJson.data.user.name}, Role=${registeredJson.data.user.role}, Dept=${registeredJson.data.user.department}\n`);
  } else {
    console.error('❌ Failed to fetch registered user!');
  }

  const unregEmail = `brandnewuser_${Date.now()}@gmail.com`;
  console.log(`2. Testing login for non-existent user ${unregEmail}...`);
  const unregisteredRes = await fetch(`${API_BASE}/auth/session`, {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer mock-id-token-email',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email: unregEmail })
  });

  const unregisteredJson = await unregisteredRes.json();
  console.log(`Unregistered User Login Response (Status = ${unregisteredRes.status}):`, unregisteredJson);
  if (unregisteredRes.status === 404 && !unregisteredJson.success) {
    console.log('   ✅ SUCCESS: Properly rejected with 404! Frontend will redirect to /signup!\n');
  } else {
    console.error('❌ Unregistered user was not rejected with 404!');
  }
}

testAuthenticLogin().catch(console.error);
