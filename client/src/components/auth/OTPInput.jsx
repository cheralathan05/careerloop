// client/src/components/auth/OTPInput.jsx

import React, { useRef, useState, useEffect, useCallback } from 'react';

const OTPInput = ({ length = 6, onChange, autoFocus = true }) => {
  const [otp, setOtp] = useState(new Array(length).fill(''));
  const inputRefs = useRef([]);

  // Use useCallback to memoize the onChange call for useEffect dependency stability
  const notifyParent = useCallback((newOtp) => {
    onChange(newOtp.join(''));
  }, [onChange]);

  // Notify parent of the full OTP whenever it changes
  useEffect(() => {
    notifyParent(otp);
  }, [otp, notifyParent]);

  // Autofocus first input on mount
  useEffect(() => {
    if (autoFocus && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [autoFocus]);

  const handleChange = (e, index) => {
    const { value } = e.target;
    const digit = value.replace(/\D/g, ''); // Ensure only digits, ignoring non-digits
    if (!digit) return; // Ignore if input is cleared (handled by keydown/backspace)

    const newOtp = [...otp];
    newOtp[index] = digit.slice(-1); // Take only the last digit entered
    setOtp(newOtp);

    // Move focus forward to the next input field
    if (index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    // Backspace: clear current and move focus backward
    if (e.key === 'Backspace') {
      e.preventDefault();
      const newOtp = [...otp];
      
      if (newOtp[index]) {
        // If current box has a value, clear it
        newOtp[index] = '';
      } else if (index > 0) {
        // If current box is empty, move to previous box and clear it
        newOtp[index - 1] = '';
        inputRefs.current[index - 1]?.focus();
      }
      setOtp(newOtp);
    }

    // Tab, Arrow navigation (Existing logic is good, just ensures optional chaining)
    if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === 'ArrowRight' && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData.getData('text').trim();
    const pasteDigits = paste.replace(/\D/g, '').slice(0, length).split('');

    if (pasteDigits.length === 0) return;

    const newOtp = [...otp];
    for (let i = 0; i < pasteDigits.length; i++) {
      newOtp[i] = pasteDigits[i];
      // Directly update the input value for visual consistency on paste
      if (inputRefs.current[i]) inputRefs.current[i].value = pasteDigits[i]; 
    }
    setOtp(newOtp);

    // ✨ ENHANCEMENT: Focus the first empty input or the last input
    const lastFilledIndex = pasteDigits.length - 1;
    const focusIndex = lastFilledIndex < length - 1 ? lastFilledIndex + 1 : length - 1;
    
    // Set focus after the state update
    inputRefs.current[focusIndex]?.focus();
  };

  return (
    <div className="flex justify-center space-x-3" onPaste={handlePaste}>
      {otp.map((digit, index) => (
        <input
          key={index}
          ref={(el) => (inputRefs.current[index] = el)}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*" // More correct pattern attribute
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          // onPaste is handled on the container div for better event capturing
          
          className="w-12 h-12 text-center text-xl font-semibold border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-150"
          // Disable default browser features that interfere with OTP boxes
          autoComplete="off"
          // Accessibility: Inform screen readers about the progress
          aria-label={`OTP digit ${index + 1}`}
          aria-current={!digit ? 'false' : 'true'} 
        />
      ))}
    </div>
  );
};

export default OTPInput;