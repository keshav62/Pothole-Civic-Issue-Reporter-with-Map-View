import admin from 'firebase-admin';

if (!admin.apps.length) {
  const requiredVars = [
    'FIREBASE_PROJECT_ID',
    'FIREBASE_PRIVATE_KEY',
    'FIREBASE_CLIENT_EMAIL',
  ];

  for (const v of requiredVars) {
    if (!process.env[v]) {
      throw new Error(`Missing Firebase Admin env var: ${v}`);
    }
  }

  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    }),
  });
}

export default admin;
