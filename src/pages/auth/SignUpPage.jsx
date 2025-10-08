// src/pages/auth/SignUpPage.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import SignUpForm from '../../components/auth/SignUpForm';

const SignUpPage = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
            <div className="w-full max-w-md">
                <SignUpForm />
                
                <div className="mt-6 text-center">
                    <p className="text-gray-600 text-sm">
                        Already have an account? 
                        <Link to="/auth/login" className="ml-1 text-indigo-600 font-medium hover:text-indigo-800 transition">
                            Log In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SignUpPage;