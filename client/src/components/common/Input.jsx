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
  ...rest
}) => {
  return (
    <div className="mb-4">
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`
          w-full px-3 py-2 border border-gray-300 rounded-md
          focus:outline-none focus:ring-2 focus:ring-indigo-500
          ${className}
        `}
        {...rest}
      />
    </div>
  );
};

export default Input;
