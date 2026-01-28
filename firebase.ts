
// Use named imports to fix property access errors in Modular Firebase SDK (v9+)
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, onAuthStateChanged, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

/**
 * Firebase configuration for BloodLink BD.
 * Connected to project: bloodlinkbd-e3f3f
 */

const firebaseConfig = {
  apiKey: "AIzaSyASaT3Hd-VtIecYCDgBdRcEbYRik6uXvvQ",
  authDomain: "bloodlinkbd-e3f3f.firebaseapp.com",
  databaseURL: "https://bloodlinkbd-e3f3f-default-rtdb.firebaseio.com",
  projectId: "bloodlinkbd-e3f3f",
  storageBucket: "bloodlinkbd-e3f3f.firebasestorage.app",
  messagingSenderId: "469618421134",
  appId: "1:469618421134:web:a92d193007e37548fe88df"
};

// Admin Email Identity
export const ADMIN_EMAIL = 'email2razibul@gmail.com';

// Initialize Firebase App
// Directly using the imported initializeApp, getApps, and getApp functions
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firebase Services explicitly with the app instance
export const auth = getAuth(app);
export const db = getFirestore(app);

// Re-export standard Auth functions for modular usage across the app
export { 
  onAuthStateChanged, 
  signOut, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword 
};
