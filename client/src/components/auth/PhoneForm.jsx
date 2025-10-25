import React, { useState } from 'react';
import { Button } from '../common/Button'; // Fixed component
import { InputField } from '../ui/InputField'; // CRITICAL FIX: Use correct component name
import { showToast } from '../../utils/toastNotifications'; // Use fixed utility

/**
 * @desc Component for collecting a user's phone number to initiate SMS OTP verification.
 * @param {function} onSubmit - Callback function to send the cleaned number to the service.
 * @param {boolean} loading - Loading state.
 * @param {string} externalError - Error message from the service/API.
 */
const PhoneForm = ({ onSubmit, loading, externalError }) => {
    const [phoneNumber, setPhoneNumber] = useState('');
    // Use internal state for client-side validation errors
    const [validationError, setValidationError] = useState('');

    // Combined error for display
    const displayError = validationError || externalError;

    const handleSubmit = (e) => {
        e.preventDefault();
        setValidationError(''); // Clear previous error

        // Trim spaces and ensure the number is clean for submission
        const trimmedNumber = phoneNumber.replace(/\s+/g, '');

        // Enhanced Validation: Allows optional '+' followed by 10 to 15 digits
        const phoneRegex = /^\+?\d{10,15}$/; 
        
        if (!phoneRegex.test(trimmedNumber)) {
            const msg = 'Please enter a valid phone number, including the country code (e.g., +1234567890).';
            setValidationError(msg);
            showToast(msg, 'warning'); // Use standardized toast for non-disruptive feedback
            return;
        }

        // Call the parent onSubmit function with the cleaned number
        onSubmit(trimmedNumber);
    };

    const handleChange = (e) => {
        // Clear validation error when user starts typing again
        if (validationError) setValidationError('');
        setPhoneNumber(e.target.value);
    }

    return (
        // Applying dark theme styling consistent with other auth forms
        <form
            onSubmit={handleSubmit}
            className="p-8 rounded-xl shadow-2xl w-full max-w-md bg-gray-800 border border-blue-700"
        >
            <h2 className="text-3xl font-extrabold mb-6 text-center 
                             bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500">
                Phone Verification
            </h2>

            {/* CRITICAL FIX: Use standardized InputField and pass error via prop */}
            <InputField
                label="Phone Number"
                type="tel"
                value={phoneNumber}
                onChange={handleChange}
                placeholder="e.g., +1 555 123 4567"
                inputMode="tel" 
                required
                error={displayError} // Pass the unified error down to the input field
            />

            <Button 
                type="submit" 
                loading={loading} // Use loading prop
                disabled={loading} 
                // Dark theme primary button styling
                className="w-full mt-4 bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-400 hover:to-cyan-400"
                variant="primary"
            >
                {loading ? 'Sending OTP...' : 'Send OTP via SMS'}
            </Button>
            
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 text-center">
                We'll send a code to verify this number. Standard rates apply.
            </p>
        </form>
    );
};

export default PhoneForm;