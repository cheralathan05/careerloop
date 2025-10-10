// client/src/pages/NotFound.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 text-center">
      <h1 className="text-9xl font-extrabold text-indigo-600">404</h1>
      <h2 className="text-4xl font-bold text-gray-800 mb-4">Page Not Found</h2>
      <p className="text-lg text-gray-600 mb-8">
        Oops! The page you are looking for might have been removed or never existed.
      </p>
      <Link to="/">
        <Button className="px-6 py-3 text-lg">
          Go to Homepage
        </Button>
      </Link>
    </div>
  );
};

export default NotFound;