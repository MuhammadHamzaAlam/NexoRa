// import { initializeApp } from 'firebase/app';

// import { getAuth } from 'firebase/auth';



// // Your Firebase configuration object from Firebase Console



// const firebaseConfig = {
//  apiKey: "AIzaSyCbF2IHEt43LOlrnls79rynhlcx-OYm1C0",
//  authDomain: "demandiq-b387f.firebaseapp.com",
//  projectId: "demandiq-b387f",
//  storageBucket: "demandiq-b387f.firebasestorage.app",
//  messagingSenderId: "263616262367",
//  appId: "1:263616262367:web:5a6f9e411adf1fa4c2396a"

// };





// // Initialize Firebase

// const app = initializeApp(firebaseConfig);

// // Initialize Firebase Authentication

// export const auth = getAuth(app);

// firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'; // <-- IMPORTANT: Added this import for Firestore

// Global variables provided by Canvas Environment
// These are automatically available in the Canvas environment.
// Use them for initialization for better integration.
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {
  // IMPORTANT: This API Key MUST be valid and unrestricted for your Firebase project.
  // If you are still getting 'auth/invalid-api-key' error, please:
  // 1. Double-check the key in Firebase Console -> Project settings -> General -> Your apps.
  // 2. Go to Google Cloud Console -> APIs & Services -> Credentials.
  //    Find this API key and ensure it has no HTTP referrer or IP restrictions
  //    that prevent it from being used by your current frontend URL (e.g., localhost or Canvas iframe).
  apiKey: "AIzaSyCbF2IHEt43LOlrnls79rynhlcx-OYm1C0", // <-- VERIFY THIS KEY IS CORRECT AND UNRESTRICTED
  authDomain: "demandiq-b387f.firebaseapp.com",
  projectId: "demandiq-b387f",
  storageBucket: "demandiq-b387f.firebasestorage.app",
  messagingSenderId: "263616262367",
  appId: "1:263616262367:web:5a6f9e411adf1fa4c2396a"
};

// Initialize Firebase App only once, and give it a unique name (appId).
// This prevents the "Firebase App named '[DEFAULT]' already exists" error.
const app = initializeApp(firebaseConfig, appId); // <-- IMPORTANT: Added appId as the second argument

// Initialize Firebase Authentication and Firestore
export const auth = getAuth(app);
export const db = getFirestore(app); // <-- IMPORTANT: Exporting db now
