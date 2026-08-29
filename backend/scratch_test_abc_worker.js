import dotenv from 'dotenv';
dotenv.config({ path: './.env' });

const API_BASE = 'http://localhost:5000/api';

async function testAbcSignup() {
  console.log('Testing session creation for Field Worker abc@gmail.com...');
  const res = await fetch(`${API_BASE}/auth/session`, {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer mock-id-token-email',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: 'abc',
      email: 'abc@gmail.com',
      role: 'FIELD_WORKER',
      department: 'Road Maintenance',
      ward: 'Ward 12 - Andheri East'
    })
  });

  const json = await res.json();
  console.log('Session response:', json);
}

testAbcSignup().catch(console.error);
