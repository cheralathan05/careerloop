// client/src/components/common/Button.jsx

import React from 'react';

const Button = ({
  children,
  onClick,
  type = 'button',
  disabled = false,
  className = '',
  // Enhancement: Use a specific prop for screen reader loading status
  isLoading = false, 
  ...rest
}) => {
  
  // Determine the final disabled state, often tied to isLoading
  const isDisabled = disabled || isLoading;

  // Define default and dynamic styles
  const baseStyles = 'px-4 py-2 font-semibold text-white rounded-md transition duration-150 ease-in-out';
  
  const disabledStyles = 'bg-indigo-300 cursor-not-allowed';
  
  const activeStyles = 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      // 🚨 Accessibility Enhancement: Inform screen readers when the button is processing
      aria-live={isLoading ? 'assertive' : 'off'} 
      aria-busy={isLoading}
      
      // Cleaned-up class concatenation
      className={`${baseStyles} ${isDisabled ? disabledStyles : activeStyles} ${className}`}
      {...rest}
    >
      {/* Optional: If you use the isLoading prop, you might show a spinner here
        {isLoading ? <Spinner /> : children} 
      */}
      {children}
    </button>
  );
};

export default Button;