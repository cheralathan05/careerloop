// client/src/components/auth/AuthLoader.jsx

import React from 'react';
import Loader from '../common/Loader'; // Assuming a simple Loader component exists

const AuthLoader = () => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white bg-opacity-75 z-50">
      <Loader /> {/* A spinning circle or similar */}
      <p className="mt-4 text-lg text-indigo-600">
        Securing your session...
      </p>
    </div>
  );
};

export default AuthLoader;

// --- Example for client/src/components/common/Loader.jsx ---
/*
const Loader = () => (
    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
);
export default Loader;
*/