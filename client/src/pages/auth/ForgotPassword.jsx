// client/src/pages/auth/ForgotPassword.jsx

import React from 'react';
import PasswordResetForm from '../../components/auth/PasswordResetForm';

const ForgotPassword = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <PasswordResetForm type="forgot" />
    </div>
  );
};

export default ForgotPassword;
