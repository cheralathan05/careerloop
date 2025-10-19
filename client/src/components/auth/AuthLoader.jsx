// client/src/components/auth/AuthLoader.jsx

import React from 'react';
import Loader from '../common/Loader'; // Assuming a simple Loader component exists

const AuthLoader = () => {
  return (
    // 1. Accessibility: role="status" informs screen readers this element shows status
    <div 
      className="fixed inset-0 flex flex-col items-center justify-center bg-white bg-opacity-75 z-50"
      role="status" 
      aria-live="polite" // Indicates that updates are important and should be announced
    >
      <Loader /> {/* A spinning circle or similar */}
      
      {/* 2. Clarity: Use a span for better semantics or keep as p */}
      <p className="mt-4 text-lg text-indigo-600 font-medium">
        Securing your session... Please wait.
      </p>

      {/* 3. Accessibility: Visually hidden text for screen reader context */}
      <span className="sr-only">Loading authentication status.</span>
    </div>
  );
};

export default AuthLoader;