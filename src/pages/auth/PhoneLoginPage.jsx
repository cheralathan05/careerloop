// src/pages/auth/PhoneLoginPage.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import PhoneLoginForm from '../../components/auth/PhoneLoginForm'; // Assumed to be created

const PhoneLoginPage = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
            <div className="w-full max-w-md">
                <PhoneLoginForm />
                
                <div className="mt-6 text-center">
                    <p className="text-gray-600 text-sm">
                        Prefer email/password? 
                        <Link to="/auth/login" className="ml-1 text-indigo-600 font-medium hover:text-indigo-800 transition">
                            Log In Here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PhoneLoginPage;