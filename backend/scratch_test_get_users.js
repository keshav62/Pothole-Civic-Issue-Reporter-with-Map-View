import dotenv from 'dotenv';
dotenv.config({ path: './.env' });

const API_BASE = 'http://localhost:5000/api';

async function testGetUsers() {
  console.log('Testing GET /api/users endpoint...');
  const res = await fetch(`${API_BASE}/users`, {
    headers: {
      'Authorization': 'Bearer mock-id-token-email'
    }
  });

  const json = await res.json();
  console.log(`GET /api/users Status = ${res.status}:`);
  console.log(`Total real MongoDB users returned: ${json.data?.users?.length}`);
  if (json.data?.users?.length > 0) {
    console.log('First 3 users in MongoDB Atlas:');
    json.data.users.slice(0, 3).forEach(u => console.log(`  - Name: ${u.name}, Email: ${u.email}, Role: ${u.role}`));
  }
}

testGetUsers().catch(console.error);
