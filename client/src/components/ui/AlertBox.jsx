import React from 'react';
import { XCircle, CheckCircle, AlertTriangle, Info } from 'lucide-react';

/**
 * @desc Reusable alert component for displaying status messages (e.g., non-toast feedback).
 * Uses Tailwind CSS classes based on the 'type' prop for color coding.
 * @param {string} type - 'success', 'error', 'warning', or 'info'.
 * @param {string} message - The message text to display.
 * @param {string} className - Optional Tailwind class string for external styling.
 */
export const AlertBox = ({ type = 'info', message, className = '' }) => {
    // Return null if there's no message to display
    if (!message) return null;
    
    // Define all style classes and corresponding Lucide icons
    const styles = {
        success: {
            bg: 'bg-green-50 dark:bg-green-900/30',
            border: 'border-green-400',
            text: 'text-green-700 dark:text-green-300',
            icon: CheckCircle,
        },
        error: {
            bg: 'bg-red-50 dark:bg-red-700/30',
            border: 'border-red-400',
            text: 'text-red-700 dark:text-red-300',
            icon: XCircle,
        },
        warning: {
            bg: 'bg-yellow-50 dark:bg-yellow-700/30',
            border: 'border-yellow-400',
            text: 'text-yellow-700 dark:text-yellow-300',
            icon: AlertTriangle,
        },
        info: {
            bg: 'bg-blue-50 dark:bg-blue-700/30',
            border: 'border-blue-400',
            text: 'text-blue-700 dark:text-blue-300',
            icon: Info,
        },
    };
    
    // Fallback to 'info' style if an unknown type is provided
    const { bg, border, text, icon: Icon } = styles[type] || styles.info;

    return (
        <div 
            className={`p-4 rounded-lg border-l-4 ${bg} ${border} shadow-sm flex items-start w-full ${className}`}
            role="alert"
        >
            {/* Render the icon */}
            <Icon className={`w-5 h-5 mr-3 flex-shrink-0 ${text}`} />
            
            {/* Render the message */}
            <p className={`text-sm ${text} font-medium`}>
                {message}
            </p>
        </div>
    );
};