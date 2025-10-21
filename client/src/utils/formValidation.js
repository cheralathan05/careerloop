// src/utils/formValidation.js

export const validateUserDetails = (data) => {
    const errors = {};
    if (!data.fullName) errors.fullName = "Full Name is required.";
    if (!data.email) {
        errors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
        errors.email = "Email address is invalid.";
    }
    if (!data.educationLevel) errors.educationLevel = "Education Level is required.";
    if (data.primarySkills.length < 1) errors.primarySkills = "Select at least one skill.";
    
    return errors;
};

// Placeholder for other validation functions
export const validateLoginForm = (data) => {
    // ...
};