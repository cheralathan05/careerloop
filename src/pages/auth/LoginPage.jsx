// src/pages/auth/LoginPage.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import LoginForm from '../../components/auth/LoginForm';
import GoogleLoginButton from '../../components/auth/GoogleLoginButton';

const LoginPage = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
            <div className="w-full max-w-md">
                {/* Email/Password Form */}
                <LoginForm />

                <div className="my-6 flex items-center">
                    <div className="flex-grow border-t border-gray-300"></div>
                    <span className="flex-shrink mx-4 text-gray-500 text-sm">OR</span>
                    <div className="flex-grow border-t border-gray-300"></div>
                </div>

                {/* Social Login */}
                <GoogleLoginButton />

                <div className="mt-4 text-center space-y-2">
                    <Link to="/auth/forgot-password" className="block text-sm text-indigo-600 hover:text-indigo-800 transition">
                        Forgot Password?
                    </Link>
                    <p className="text-gray-600 text-sm">
                        Don't have an account? 
                        <Link to="/auth/signup" className="ml-1 text-indigo-600 font-medium hover:text-indigo-800 transition">
                            Sign Up
                        </Link>
                    </p>
                    <p className="text-gray-600 text-sm">
                        Use phone number? 
                        <Link to="/auth/phone-login" className="ml-1 text-indigo-600 font-medium hover:text-indigo-800 transition">
                            Phone Login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;