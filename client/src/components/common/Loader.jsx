import React from 'react';
import { Loader2 } from 'lucide-react';

/**
 * @desc Simple, central loading spinner.
 * @param {'sm' | 'md' | 'lg'} size - Size of the spinner.
 * @param {string} message - Text displayed below the spinner.
 * @param {string} className - Optional custom classes.
 */
export const Loader = ({ size = 'lg', message = 'Loading...', className = '' }) => {
    const sizeMap = {
        sm: 'w-4 h-4',
        md: 'w-6 h-6',
        lg: 'w-8 h-8',
    };
    
    return (
        <div 
            className={`flex flex-col items-center justify-center p-8 ${className}`}
            role="status"
            aria-live="polite"
        >
            <Loader2 className={`${sizeMap[size]} text-indigo-600 dark:text-indigo-400 animate-spin mb-2`} />
            <p className="text-sm text-gray-500 dark:text-gray-400">{message}</p>
        </div>
    );
};
