import { initializeApp, cert, getApps } from 'firebase-admin/app';

const apps = getApps();

if (!apps.length) {
  const hasCreds = Boolean(
    process.env.FIREBASE_PROJECT_ID &&
    process.env.FIREBASE_PRIVATE_KEY &&
    process.env.FIREBASE_CLIENT_EMAIL
  );

  if (hasCreds) {
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      }),
    });
  } else {
    console.warn('⚠️ Firebase Admin credentials missing. Firebase token verification will return an error until configured.');
  }
}

export default { initializeApp, cert, getApps };
