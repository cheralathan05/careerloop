import { auth, googleProvider } from "./firebaseConfig";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  signInWithPopup,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";

export const registerUser = (email, password) =>
  createUserWithEmailAndPassword(auth, email, password);

export const loginUser = (email, password) =>
  signInWithEmailAndPassword(auth, email, password);

export const logoutUser = () => signOut(auth);

export const loginWithGoogle = () => signInWithPopup(auth, googleProvider);

// Phone login
export const sendOTP = async (phoneNumber, appVerifier) =>
  signInWithPhoneNumber(auth, phoneNumber, appVerifier);

export const verifyOTP = async (confirmationResult, otp) =>
  confirmationResult.confirm(otp);
