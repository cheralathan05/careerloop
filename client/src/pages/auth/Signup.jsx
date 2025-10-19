// client/src/pages/auth/Signup.jsx

import React from 'react';
import AuthForm from '../../components/auth/AuthForm';
import GoogleButton from '../../components/auth/GoogleButton'; 
import Card from '../../components/common/Card'; // 🚨 NEW: Import Card
import { Link } from 'react-router-dom';

const Signup = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
      {/* 🚨 ENHANCEMENT: Use the Card component for consistent styling and shadow */}
      <Card className="w-full max-w-sm p-0"> {/* Remove Card padding here, it's inside AuthForm */}
        
        {/* The AuthForm component contains the actual form and its styling */}
        <AuthForm type="signup" />
        
        {/* Wrapper for OR and Google Button (needs padding adjustment since AuthForm has its own) */}
        <div className="px-6 pb-6">
            
            {/* OR Separator */}
            <div className="flex items-center my-4">
              <hr className="flex-grow border-gray-300" />
              <span className="px-3 text-gray-500 text-sm">OR</span>
              <hr className="flex-grow border-gray-300" />
            </div>
            
            {/* Google Sign Up */}
            <GoogleButton />

            {/* Login Redirect Link */}
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