// src/firebase/authService.js

import { 
    auth 
} from './firebase';
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut, 
    sendPasswordResetEmail, 
    GoogleAuthProvider, 
    signInWithPopup,
    signInWithPhoneNumber,
    updatePassword, // Added for AccountSettingsPage
    sendEmailVerification, // Added for VerifyEmailPage
} from "firebase/auth";

// --- State and Helpers ---
// This is used to store the confirmation result object after sending the code.
let confirmationResult = null; 

// --- Email/Password ---

export const signUp = (email, password) => 
    createUserWithEmailAndPassword(auth, email, password);

export const login = (email, password) => 
    signInWithEmailAndPassword(auth, email, password);

export const logout = () => 
    signOut(auth);

export const resetPassword = (email) => 
    sendPasswordResetEmail(auth, email);

export const sendVerificationEmail = (user) => 
    sendEmailVerification(user);

export const updateUserPassword = (user, newPassword) =>
    updatePassword(user, newPassword);

// --- Google Login ---

const googleProvider = new GoogleAuthProvider();

export const googleLogin = () => 
    signInWithPopup(auth, googleProvider);

// --- Phone Authentication (Requires ReCAPTCHA setup in the component) ---

/**
 * Sends a verification code to the provided phone number.
 * @param {string} phoneNumber The phone number to verify (e.g., '+15551234').
 * @param {object} appVerifier The RecaptchaVerifier instance.
 */
export const sendPhoneCode = async (phoneNumber, appVerifier) => {
    // confirmationResult is stored globally to be used by verifyPhoneCode later
    confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
    return confirmationResult; // You can return this if needed for local state
};

/**
 * Verifies the code received via SMS.
 * @param {string} code The 6-digit verification code.
 */
export const verifyPhoneCode = async (code) => {
    if (!confirmationResult) {
        throw new Error("Phone verification flow not started. Call sendPhoneCode first.");
    }
    // Signs the user in and returns the UserCredential
    return await confirmationResult.confirm(code);
};