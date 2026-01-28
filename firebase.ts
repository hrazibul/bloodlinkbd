
// Fix: Using property access to bypass environment-specific TypeScript resolution issues for Firebase sub-modules
import * as appModule from 'firebase/app';
const initializeApp = (appModule as any).initializeApp;

// Fix: Bypassing potential missing named exports in firebase/auth by using the module object
import * as authModule from 'firebase/auth';
const { 
  getAuth, 
  onAuthStateChanged, 
  signOut, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword 
} = authModule as any;

import { getFirestore } from 'firebase/firestore';

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

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize and export Auth and DB instances
export const auth = getAuth(app);
export const db = getFirestore(app);

// Re-exporting common Auth functions to provide a central location for the app.
export { onAuthStateChanged, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword };
