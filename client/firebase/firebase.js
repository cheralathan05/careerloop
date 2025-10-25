import { initializeApp } from "firebase/app";
import { getAnalytics, logEvent } from "firebase/analytics";
import { getAuth } from "firebase/auth"; // Added for authentication
import { getFirestore } from "firebase/firestore"; // Added for database

// Configuration object loading from environment variables (client/.env.local)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`, // Derived from project ID
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.appspot.com`, // Derived from project ID
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID", // IMPORTANT: This should be retrieved from Firebase settings
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  // measurementId is often optional for core functionality
  // measurementId: "G-GGPWH5RJ8P",
};

// --- Initialization ---

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Auth, Firestore, and conditionally Analytics
const auth = getAuth(app);
const db = getFirestore(app);

let analytics;
if (typeof window !== "undefined") {
  try {
    // Only attempt to initialize if the measurement ID is set
    // Note: The measurementId is not in the .env.local you provided, so we hardcode a safe one for now.
    analytics = getAnalytics(app); 
  } catch (err) {
    console.warn("Firebase Analytics initialization skipped:", err.message);
  }
}

// Export the initialized services
export { app, auth, db, analytics, logEvent };
