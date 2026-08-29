import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';

// Standard Firebase configuration for CivicConnect GovTech Platform
const firebaseConfig = {
  apiKey: "AIzaSyCivicConnectGovTechKey2026Demo",
  authDomain: "civicconnect-gov.firebaseapp.com",
  projectId: "civicconnect-gov",
  storageBucket: "civicconnect-gov.appspot.com",
  messagingSenderId: "987654321098",
  appId: "1:987654321098:web:civicconnect2026demo"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication & Google Provider
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Helper functions for Firebase Google OAuth
export const signInWithGooglePopup = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return {
      success: true,
      user: result.user
    };
  } catch (error) {
    console.warn("Firebase Auth popup notice:", error.message);
    return {
      success: false,
      error: error.message
    };
  }
};

export const firebaseSignOut = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export default app;
