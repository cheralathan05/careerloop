// client/src/pages/auth/Signup.jsx

import React from 'react';
import AuthForm from '../../components/auth/AuthForm';
import Card from '../../components/common/Card'; 
import { Link } from 'react-router-dom';

const Signup = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
      <Card className="w-full max-w-sm p-0">
        {/* AuthForm contains the signup form */}
        <AuthForm type="signup" />

        {/* Footer with login redirect */}
        <div className="px-6 pb-6">
          <p className="text-center text-sm mt-4 text-gray-600">
            Already have an account?{' '}
            <Link 
              to="/login" 
              className="text-indigo-600 hover:text-indigo-800 ml-1 font-bold transition-colors"
            >
              Log in
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
};

export default Signup;
