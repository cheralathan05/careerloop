// client/src/components/auth/PhoneForm.jsx

import React, { useState } from 'react';
import Button from '../common/Button';
import Input from '../common/Input'; // Assuming this is your styled input

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
      // 🚨 Fix: Use state for non-disruptive feedback instead of alert()
      setValidationError('Please enter a valid phone number, including the country code (e.g., +1234567890).');
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
    <form
      onSubmit={handleSubmit}
      className="p-6 border rounded-lg shadow-xl w-full max-w-sm bg-white mx-auto"
    >
      <h2 className="text-2xl font-bold mb-6 text-center text-indigo-600">
        Phone Verification
      </h2>

      <Input
        type="tel"
        value={phoneNumber}
        onChange={handleChange}
        placeholder="e.g., +1 555 123 4567"
        // Use 'tel' inputMode for better mobile keyboard
        inputMode="tel" 
        // Optional: Pattern is redundant if using client-side JS validation but helps browser hint
        pattern="[\+\d\s]{10,20}" 
        required
        aria-describedby={displayError ? 'phone-error' : undefined}
      />

      {/* Unified Error Display */}
      {displayError && (
        <p id="phone-error" className="text-red-500 text-sm mt-3 text-center font-medium">
          {displayError}
        </p>
      )}

      <Button 
        type="submit" 
        disabled={loading} 
        className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300"
      >
        {loading ? 'Sending OTP...' : 'Send OTP via SMS'}
      </Button>
      
      <p className="text-xs text-gray-500 mt-3 text-center">
        We'll send a code to verify this number. Standard rates apply.
      </p>
    </form>
  );
};

export default PhoneForm;