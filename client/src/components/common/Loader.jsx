// client/src/components/common/Loader.jsx

import React from 'react';

const Loader = ({ 
  size = 'h-10 w-10', 
  color = 'border-indigo-600', // Changed default to 600 for consistency with Button
  // Enhancement: Added border thickness control for flexibility
  thickness = 'border-4', 
  className = '', 
  ...rest
}) => {
  return (
    <div
      className={`
        animate-spin rounded-full 
        ${size} 
        ${thickness} 
        border-solid 
        border-transparent 
        border-t-current 
        ${color} 
        ${className}
      `}
      role="status"
      aria-label="Loading indicator" // Slightly clearer label
      {...rest}
    >
      <span className="sr-only">Loading... Please wait.</span>
    </div>
  );
};

export default Loader;