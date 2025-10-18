// client/src/pages/auth/DashboardBeforeLogin.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/common/Button';

const DashboardBeforeLogin = () => {
  return (
    <div className="container mx-auto px-4 py-20 text-center bg-gray-50 min-h-screen-minus-nav">
      
      <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
        Secure Your Application
      </h1>

      <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
        This comprehensive authentication system includes standard login, OTP verification, and Google OAuth.
      </p>
      
      <div className="flex justify-center space-x-4">
        <Link to="/signup">
          <Button className="px-8 py-3 text-lg bg-indigo-600 hover:bg-indigo-700">
            Get Started (Sign Up)
          </Button>
        </Link>
        <Link to="/login">
          <Button className="px-8 py-3 text-lg bg-white text-indigo-600 border border-indigo-600 hover:bg-indigo-50">
            Log In
          </Button>
        </Link>
      </div>

    </div>
  );
};

export default DashboardBeforeLogin;
