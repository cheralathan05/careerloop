import React from 'react';
import { motion } from 'framer-motion';
import AuthForm from '../../components/auth/AuthForm'; // Fixed import name
import GoogleButton from '../../components/auth/GoogleButton'; // Fixed import name
import { Link } from 'react-router-dom';

// --- Animation Variants ---
const containerVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: { 
        opacity: 1, 
        y: 0,
        scale: 1,
        transition: { 
            type: 'spring', 
            stiffness: 100, 
            duration: 0.8 
        }
    }
};

const Login = () => {
    return (
        // Dark background to match Neo-Futuristic theme
        <div className="flex justify-center items-center min-h-screen bg-gray-900 px-4">
            <motion.div
                className="w-full max-w-md p-8 bg-gray-800 rounded-xl shadow-2xl shadow-cyan-900/50 border border-blue-700"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                
                {/* Title: Aligned with CareerLoop Branding */}
                <h2 className="text-3xl font-extrabold text-center mb-6 
                              bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500">
                    Access CareerLoop Console
                </h2>

                {/* Main Form Component (Login) */}
                <AuthForm type="login" />
                
                {/* Separator */}
                <div className="flex items-center my-6">
                    <hr className="flex-grow border-gray-700" />
                    <span className="px-3 text-gray-500 text-sm font-mono">OR AUTHORIZE VIA</span>
                    <hr className="flex-grow border-gray-700" />
                </div>

                {/* Social Login Button */}
                <GoogleButton />

                {/* Links Section */}
                <div className="text-center text-sm mt-6 text-gray-400 space-y-3">
                    {/* Forgot Password Link */}
                    <Link 
                        to="/forgot-password" 
                        // Highlighted in the primary accent color
                        className="text-cyan-400 hover:text-cyan-300 block transition-colors duration-200"
                    >
                        **Access Recovery Protocol?**
                    </Link>

                    <p>
                        New User? Initiate registration{' '}
                        <Link 
                            to="/signup" 
                            // Highlighted in the secondary accent color
                            className="text-purple-400 hover:text-purple-300 font-medium transition-colors duration-200"
                        >
                            Sign up here
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
