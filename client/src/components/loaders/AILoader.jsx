import React from 'react';
import { Cpu, Loader2 } from 'lucide-react';

/**
 * @desc Specific loader component used while waiting for the AI service.
 * It communicates that complex, machine computation is occurring.
 */
export const AILoader = ({ 
    text = "The AI is compiling your personalized report...", 
    className = '' 
}) => {
    return (
        <div 
            className={`flex items-center justify-center p-6 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl shadow-md ${className}`}
            role="status"
            aria-live="polite"
        >
            {/* Using Cpu icon to symbolize computation */}
            <Cpu className="w-7 h-7 text-indigo-600 animate-pulse mr-4" />
            <span className="text-indigo-700 dark:text-indigo-300 font-medium text-lg">
                {text}
            </span>
        </div>
    );
};