/**
 * @desc Utility functions for client-side form validation.
 * These functions provide immediate feedback to the user before submitting to the server.
 */

/**
 * Validates a standard email format.
 * @param {string} email - The email string to validate.
 * @returns {boolean} True if the email is in a valid format.
 */
export const isValidEmail = (email) => {
    // Standard and robust email regex
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    // Ensure the input is a string and convert to lowercase before testing
    return re.test(String(email).toLowerCase());
};

/**
 * Validates password strength based on length and complexity.
 * @param {string} password - The password string to validate.
 * @param {number} [minLength=8] - The minimum required length.
 * @returns {boolean} True if the password meets security requirements.
 */
export const isPasswordSecure = (password, minLength = 8) => {
    // Check length
    const isLongEnough = password.length >= minLength;

    // ENHANCEMENT: Check for complexity (at least one uppercase, one lowercase, one digit, one special character)
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasDigit = /[0-9]/.test(password);
    
    // You can also add a check for special characters if needed:
    // const hasSpecialChar = /[!@#$%^&*()]/.test(password);

    // For simplicity, we enforce length and basic complexity
    return isLongEnough && hasUpperCase && hasLowerCase && hasDigit;
};

/**
 * Validates a required field is not empty after trimming.
 * @param {any} value - The input value (string, number, etc.).
 * @returns {boolean} True if the value contains non-whitespace characters.
 */
export const isRequired = (value) => {
    // Check for null/undefined/empty string, and ensure it's not just whitespace
    if (value === null || value === undefined) return false;
    return String(value).trim().length > 0;
};
