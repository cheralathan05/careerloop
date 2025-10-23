// NOTE: Assuming this file is actually in src/components/common/Card.jsx based on previous context.
import React from 'react';

/**
 * @desc Reusable card container for clean data display.
 */
export const Card = ({ children, title, className = '', titleIcon: TitleIcon, ...props }) => {
    return (
        <div 
            className={`bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 ${className}`}
            {...props}
        >
            {title && (
                <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white flex items-center">
                    {TitleIcon && <TitleIcon className="w-6 h-6 mr-3 text-indigo-600 dark:text-indigo-400" />}
                    {title}
                </h2>
            )}
            {children}
        </div>
    );
};