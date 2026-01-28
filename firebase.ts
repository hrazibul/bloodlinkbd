
// Use namespace imports and destructuring to fix "no exported member" errors in environments with strict ESM/CJS resolution
import * as firebaseApp from "firebase/app";
import * as firebaseAuth from "firebase/auth";
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

// Destructure modular functions from the namespace imports to satisfy TypeScript's export checks
const { initializeApp, getApps, getApp } = firebaseApp;
const { getAuth, onAuthStateChanged, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword } = firebaseAuth;

// Initialize Firebase App
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
