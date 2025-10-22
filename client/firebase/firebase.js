// src/firebase/firebase.js
import { initializeApp } from "firebase/app";
import { getAnalytics, logEvent } from "firebase/analytics";

// Replace these with your Firebase project config
const firebaseConfig = {
  apiKey: "AIzaSyD1wkrF5xb8qy34Cfbn21daBUSs-2Ogg4Q",
  authDomain: "my-website-caa4e.firebaseapp.com",
  projectId: "my-website-caa4e",
  storageBucket: "my-website-caa4e.firebasestorage.app",
  messagingSenderId: "375307086263",
  appId: "1:375307086263:web:ddbebf9664c698d158a032",
  measurementId: "G-GGPWH5RJ8P"
};

// Initialize Firebase and GA4
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { analytics, logEvent };
