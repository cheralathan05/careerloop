/**
 * @desc Utility functions for client-side form validation.
 */

/**
 * Validates a standard email format.
 */
export const isValidEmail = (email) => {
    // Standard email regex
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
};

/**
 * Validates password length.
 */
export const isPasswordSecure = (password, minLength = 8) => {
    return password.length >= minLength;
};

/**
 * Validates a required field is not empty after trimming.
 */
export const isRequired = (value) => {
    return String(value).trim().length > 0;
};