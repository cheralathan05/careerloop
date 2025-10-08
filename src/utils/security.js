// src/utils/security.js

import { auth } from '../firebase/firebase';
import { RecaptchaVerifier } from 'firebase/auth';

/**
 * Creates and renders the Invisible reCAPTCHA verifier.
 * @param {string} containerId The ID of the HTML element to render the reCAPTCHA into.
 * @returns {RecaptchaVerifier} The reCAPTCHA verifier instance.
 */
export const setupRecaptcha = (containerId) => {
    // The RecaptchaVerifier needs a visible container element, 
    // even if it's styled to be hidden or minimized (Invisible).
    const verifier = new RecaptchaVerifier(auth, containerId, {
        'size': 'invisible', // Use 'normal' or 'invisible'
        'callback': (response) => {
            // reCAPTCHA solved, continue with phone sign-in.
            console.log("reCAPTCHA solved:", response);
        },
        'expired-callback': () => {
            // reCAPTCHA expired. You can handle the error here.
            console.log("reCAPTCHA expired.");
        }
    });
    return verifier;
};