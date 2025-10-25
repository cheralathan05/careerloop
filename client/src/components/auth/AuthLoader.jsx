// client/src/components/auth/AuthLoader.jsx
import React from "react";
import Loader from "../common/Loader"; // A simple spinner or pulse animation

const AuthLoader = () => {
  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center 
                 bg-white/80 backdrop-blur-sm z-50 animate-fadeIn"
      role="status"
      aria-live="polite"
    >
      {/* Spinner */}
      <Loader size="lg" color="indigo" />

      {/* Message */}
      <p className="mt-4 text-lg text-indigo-700 font-semibold text-center">
        Securing your session... Please wait.
      </p>

      {/* Screen-reader text for accessibility */}
      <span className="sr-only">Authenticating user session, please wait.</span>
    </div>
  );
};

export default AuthLoader;
