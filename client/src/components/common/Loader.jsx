import React from 'react';
import { Loader2 } from 'lucide-react';

/**
 * @desc Simple, central loading spinner.
 */
export const Loader = ({ size = 'lg', message = 'Loading...', className = '' }) => {
    const sizeMap = {
        sm: 'w-4 h-4',
        md: 'w-6 h-6',
        lg: 'w-8 h-8',
    };
    
    return (
        <div className={`flex flex-col items-center justify-center p-8 ${className}`}>
            <Loader2 className={`${sizeMap[size]} text-indigo-600 animate-spin mb-2`} />
            <p className="text-sm text-gray-500 dark:text-gray-400">{message}</p>
        </div>
    );
};