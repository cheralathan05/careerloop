// client/src/components/loaders/AuthLoader.jsx
import React from 'react';
import { motion } from 'framer-motion';

/**
 * @desc Full-screen loader to show while authentication status is being checked.
 */
const AuthLoader = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 z-50">
      <motion.div
        className="w-16 h-16 border-4 border-t-cyan-400 border-b-purple-500 border-l-gray-700 border-r-gray-700 rounded-full"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
      />
      <motion.p
        className="absolute mt-24 text-gray-300 font-mono text-lg"
        animate={{ opacity: [0, 1, 0] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
      >
        Verifying session...
      </motion.p>
    </div>
  );
};

export default AuthLoader;
