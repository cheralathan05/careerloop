// NOTE: Assuming this file is actually in src/components/common/Input.jsx based on previous context.
import React from 'react';

/**
 * @desc Reusable input field component (renamed from InputField to Input).
 */
export const InputField = ({ label, type = 'text', className = '', required = false, ...props }) => {
    return (
        <div className={`mb-4 ${className}`}>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <input
                type={type}
                required={required}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                {...props}
            />
        </div>
    );
};