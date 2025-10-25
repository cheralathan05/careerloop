import React, { useRef, useState, useEffect, useCallback } from "react";

const OTPInput = ({ length = 6, onChange, autoFocus = true }) => {
  const [otp, setOtp] = useState(Array(length).fill(""));
  const inputRefs = useRef([]);

  // 🔁 Memoized callback for notifying parent
  const notifyParent = useCallback(
    (newOtp) => {
      if (onChange) onChange(newOtp.join(""));
    },
    [onChange]
  );

  // 🔔 Notify parent on OTP change
  useEffect(() => {
    notifyParent(otp);
  }, [otp, notifyParent]);

  // 🎯 Auto-focus first input on mount
  useEffect(() => {
    if (autoFocus && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [autoFocus]);

  // Handle typing
  const handleChange = (e, index) => {
    const value = e.target.value.replace(/\D/g, ""); // Only digits
    if (!value) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // Take only last digit
    setOtp(newOtp);

    // Move to next box
    if (index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const newOtp = [...otp];

      if (newOtp[index]) {
        newOtp[index] = "";
      } else if (index > 0) {
        newOtp[index - 1] = "";
        inputRefs.current[index - 1]?.focus();
      }

      setOtp(newOtp);
    }

    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowRight" && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle paste
  const handlePaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text").trim();
    const digits = paste.replace(/\D/g, "").slice(0, length).split("");
    if (!digits.length) return;

    const newOtp = [...otp];
    digits.forEach((digit, i) => {
      newOtp[i] = digit;
      if (inputRefs.current[i]) inputRefs.current[i].value = digit;
    });
    setOtp(newOtp);

    const focusIndex = digits.length < length ? digits.length : length - 1;
    inputRefs.current[focusIndex]?.focus();
  };

  return (
    <div
      className="flex justify-center space-x-3 select-none"
      onPaste={handlePaste}
      role="group"
      aria-label="One-time password input"
    >
      {otp.map((digit, index) => (
        <input
          key={index}
          ref={(el) => (inputRefs.current[index] = el)}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          autoComplete="off"
          aria-label={`OTP digit ${index + 1} of ${length}`}
          className="w-12 h-12 text-center text-2xl font-semibold border border-gray-300 rounded-lg 
                     focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent 
                     transition duration-150 bg-white shadow-sm"
        />
      ))}
    </div>
  );
};

export default OTPInput;
