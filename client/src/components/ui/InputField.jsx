import React from 'react';

/**
 * @desc Reusable input field component (renamed from InputField to Input).
 * @param {string} label - The text label for the input.
 * @param {string} type - The input type (text, email, password, etc.).
 * @param {string} className - Optional Tailwind class string for external styling.
 * @param {boolean} required - Marks the field as required.
 * @param {string} error - An error message string (if truthy, applies error styles).
 */
export const InputField = ({ label, type = 'text', className = '', required = false, error, ...props }) => {
    
    // Determine input class based on error state
    const inputClasses = `w-full px-3 py-2 border rounded-lg shadow-sm 
        focus:outline-none 
        dark:bg-gray-700 dark:text-white 
        ${error 
            ? 'border-red-400 focus:ring-red-500 focus:border-red-500 dark:border-red-600' 
            : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 dark:border-gray-600'
        }`;

    return (
        <div className={`mb-4 ${className}`}>
            {/* Label */}
            <label 
                htmlFor={props.id || props.name} // Associate label with input by id/name
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            
            {/* Input Element */}
            <input
                type={type}
                required={required}
                // Apply combined classes
                className={inputClasses}
                {...props}
            />
            
            {/* Error Feedback */}
            {error && (
                <p className="mt-1 text-xs text-red-500 dark:text-red-400">
                    {error}
                </p>
            )}
        </div>
    );
};

