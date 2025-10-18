// client/src/components/auth/PhoneForm.jsx

import React, { useState } from 'react';
import Button from '../common/Button';
import Input from '../common/Input';

const PhoneForm = ({ onSubmit, loading, error }) => {
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // Trim spaces and validate phone number length
    const trimmedNumber = phoneNumber.replace(/\s+/g, '');
    if (!/^\+?\d{10,15}$/.test(trimmedNumber)) {
      alert('Please enter a valid phone number (10–15 digits, optional +).');
      return;
    }

    onSubmit(trimmedNumber);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 border rounded-lg shadow-md w-full max-w-sm bg-white"
    >
      <h2 className="text-2xl font-bold mb-6 text-center text-indigo-600">
        Enter Phone Number
      </h2>

      <Input
        type="tel"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        placeholder="e.g., +1234567890"
        pattern="\+?\d{10,15}"
        required
      />

      {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}

      <Button type="submit" disabled={loading} className="w-full mt-4">
        {loading ? 'Sending OTP...' : 'Send OTP via SMS'}
      </Button>
    </form>
  );
};

export default PhoneForm;
