import React, { useState, useCallback } from 'react';
import { Info } from 'lucide-react';

/**
 * @desc Reusable tooltip wrapper that shows text on hover.
 */
export const Tooltip = ({ content, position = 'top', children }) => {
    const [isVisible, setIsVisible] = useState(false);
    
    const positionClasses = {
        top: 'bottom-full mb-2 left-1/2 transform -translate-x-1/2',
        bottom: 'top-full mt-2 left-1/2 transform -translate-x-1/2',
        left: 'right-full mr-2 top-1/2 transform -translate-y-1/2',
        right: 'left-full ml-2 top-1/2 transform -translate-y-1/2',
    };
    
    const handleMouseEnter = useCallback(() => setIsVisible(true), []);
    const handleMouseLeave = useCallback(() => setIsVisible(false), []);

    return (
        <div 
            className="relative inline-flex"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {/* Trigger Element */}
            {children || <Info className="w-4 h-4 text-gray-400 dark:text-gray-500 cursor-pointer" />}

            {/* Tooltip Content */}
            {isVisible && content && (
                <div 
                    className={`absolute z-20 w-max max-w-xs p-2 text-xs text-white bg-gray-800 dark:bg-gray-700 rounded-lg shadow-xl opacity-95 transition-opacity duration-150 ${positionClasses[position]}`}
                >
                    {content}
                </div>
            )}
        </div>
    );
};