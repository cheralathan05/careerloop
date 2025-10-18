// client/src/components/common/Button.jsx

import React from 'react';

const Button = ({
  children,
  onClick,
  type = 'button',
  disabled = false,
  className = '',
  ...rest
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        px-4 py-2 font-semibold text-white rounded-md transition duration-150 ease-in-out
        ${disabled
          ? 'bg-indigo-300 cursor-not-allowed'
          : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
        }
        ${className}
      `}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
