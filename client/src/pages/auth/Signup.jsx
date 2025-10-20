// client/src/pages/auth/Signup.jsx

import React from 'react';
import { motion } from 'framer-motion'; // Import motion for animation
import AuthForm from '../../components/auth/AuthForm';
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

const Signup = () => {
  return (
    // Dark background to match Neo-Futuristic theme
    <div className="flex justify-center items-center min-h-screen bg-gray-900 px-4">
      <motion.div
        // Styling matches the dark, bordered Auth component from Login.jsx
        className="w-full max-w-md p-8 bg-gray-800 rounded-xl shadow-2xl shadow-purple-900/50 border border-blue-700"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        
        {/* Title: Aligned with CareerLoop Branding */}
        <h2 className="text-3xl font-extrabold text-center mb-6 
                      bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500">
          Initiate User Registration
        </h2>

        {/* AuthForm contains the signup form. No separate p-0 padding needed as p-8 is on the parent div */}
        <AuthForm type="signup" />

        {/* Footer with login redirect */}
        <div className="pt-4 mt-6 border-t border-gray-700">
          <p className="text-center text-sm text-gray-400">
            Existing user? Return to{' '}
            <Link 
              to="/login" 
              // Highlighted in the secondary accent color
              className="text-purple-400 hover:text-purple-300 ml-1 font-bold transition-colors"
            >
              Access Console
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;