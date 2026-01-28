// Consolidated Firebase modular imports to resolve "no exported member" errors by matching working single-line patterns
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, onAuthStateChanged, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

/**
 * Firebase configuration for BloodLink BD.
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

export const ADMIN_EMAIL = 'email2razibul@gmail.com';

// Initialize Firebase App instance
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize and export services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Export standard Auth functions
export { 
  onAuthStateChanged, 
  signOut, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword 
};
