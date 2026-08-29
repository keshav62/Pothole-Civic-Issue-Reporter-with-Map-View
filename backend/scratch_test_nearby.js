import dotenv from 'dotenv';
dotenv.config({ path: './.env' });

const API_BASE = 'http://localhost:5000/api';

async function testGetNearby() {
  console.log('Testing GET /api/issues/nearby?lat=19.0760&lng=72.8777&radius=50000...');
  const res = await fetch(`${API_BASE}/issues/nearby?lat=19.0760&lng=72.8777&radius=50000`);

  const json = await res.json();
  console.log(`GET /api/issues/nearby Status = ${res.status}:`);
  console.log('Response envelope:', JSON.stringify(json, null, 2));
}

testGetNearby().catch(console.error);
