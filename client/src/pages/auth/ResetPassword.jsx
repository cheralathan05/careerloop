// client/src/pages/auth/ResetPassword.jsx

import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import PasswordResetForm from '../../components/auth/PasswordResetForm';

const ResetPassword = () => {
  const location = useLocation();
  const [token, setToken] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const urlToken = params.get('token');
    if (urlToken) setToken(urlToken);
  }, [location.search]);

  if (!token) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
        <div className="text-center p-6 border rounded-lg shadow-md bg-white">
          <p className="text-red-500">
            Invalid or missing reset token. Please check your email link.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
      <PasswordResetForm type="reset" token={token} />
    </div>
  );
};

export default ResetPassword;
