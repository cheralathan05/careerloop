// src/firebase/firebase.js
import { initializeApp } from "firebase/app";
import { getAnalytics, logEvent } from "firebase/analytics";

// ✅ Replace with your actual Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyD1wkrF5xb8qy34Cfbn21daBUSs-2Ogg4Q",
  authDomain: "my-website-caa4e.firebaseapp.com",
  projectId: "my-website-caa4e",
  storageBucket: "my-website-caa4e.appspot.com", // ✅ fix: should end with .appspot.com
  messagingSenderId: "375307086263",
  appId: "1:375307086263:web:ddbebf9664c698d158a032",
  measurementId: "G-GGPWH5RJ8P",
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Initialize Analytics only if running in browser
let analytics;
if (typeof window !== "undefined") {
  try {
    analytics = getAnalytics(app);
  } catch (err) {
    console.warn("Analytics initialization skipped:", err.message);
  }
}

export { app, analytics, logEvent };
