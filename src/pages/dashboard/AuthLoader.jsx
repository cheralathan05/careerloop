import React from "react";

const AuthLoader = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <div className="flex flex-col items-center space-y-3">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
        <p className="text-sm text-gray-600 font-medium">Checking authentication...</p>
      </div>
    </div>
  );
};

export default AuthLoader;
