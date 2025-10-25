import React from 'react';
import { Cpu } from 'lucide-react';

/**
 * @desc Loader component used when waiting for AI computation or processing.
 * @param {string} text - Optional text to display next to the loader.
 * @param {string} className - Optional additional classes for customization.
 */
export const AILoader = ({ 
    text = "The AI is compiling your personalized report...", 
    className = '' 
}) => {
    return (
        <div 
            // Theme-aware background and styling
            className={`flex items-center justify-center p-6 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl shadow-md ${className}`}
            // Accessibility attributes
            role="status"
            aria-live="polite"
        >
            {/* Icon representing computation (pulse animation is visually engaging) */}
            <Cpu className="w-7 h-7 text-indigo-600 animate-pulse mr-4 flex-shrink-0" />
            
            {/* Descriptive text */}
            <span className="text-indigo-700 dark:text-indigo-300 font-medium text-lg text-center">
                {text}
            </span>
        </div>
    );
};

