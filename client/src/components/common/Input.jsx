// client/src/components/common/Input.jsx

import React from 'react';

const Input = ({
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  required = false,
  className = '',
  // --- Accessibility & Validation Enhancements ---
  label, // Optional label text
  error, // Boolean or string indicating an error state
  errorId, // Unique ID for the error message (required for aria-describedby)
  // ---------------------------------------------
  ...rest
}) => {
  
  // Dynamic border styling based on error prop
  const errorStyles = error 
    ? 'border-red-500 focus:ring-red-500' 
    : 'border-gray-300 focus:ring-indigo-500';

  return (
    <div className={`mb-4 ${className}`}>
      
      {/* 1. Label Support (Accessibility) */}
      {label && (
        <label 
          htmlFor={name} 
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <input
        // The id MUST match the label's htmlFor for accessibility
        id={name} 
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        // 2. Accessibility: Link to an error message if one exists
        aria-invalid={!!error}
        aria-describedby={error && errorId ? errorId : undefined}
        
        className={`
          w-full px-3 py-2 border rounded-md transition duration-150 ease-in-out
          focus:outline-none focus:ring-2 focus:ring-offset-0 
          ${errorStyles}
        `}
        {...rest}
      />
      
      {/* 3. Error Message Slot */}
      {error && (
        // The id here is what the input's aria-describedby references
        <p id={errorId || `${name}-error`} className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}

    </div>
  );
};

export default Input;