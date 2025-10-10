// client/src/components/auth/OTPInput.jsx

import React, { useRef, useState } from 'react';

const OTPInput = ({ length = 6, onChange }) => {
    const [otp, setOtp] = useState(new Array(length).fill(''));
    const inputRefs = useRef([]);

    const handleChange = (element, index) => {
        if (isNaN(element.value)) return false;

        // Update the array state
        const newOtp = [...otp];
        newOtp[index] = element.value;
        setOtp(newOtp);
        
        // Pass the full OTP string up to the parent component
        onChange(newOtp.join(""));

        // Focus next input
        if (element.value !== '' && index < length - 1) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (e, index) => {
        // Move focus to previous input on backspace if current field is empty
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    return (
        <div className="flex justify-center space-x-2">
            {otp.map((data, index) => (
                <input
                    key={index}
                    ref={el => inputRefs.current[index] = el}
                    type="text"
                    name={`otp-${index}`}
                    maxLength="1"
                    value={data}
                    onChange={(e) => handleChange(e.target, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    className="w-10 h-12 text-center text-xl border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    style={{ WebkitAppearance: 'none', MozAppearance: 'textfield' }} // Hide number arrows
                />
            ))}
        </div>
    );
};

export default OTPInput;