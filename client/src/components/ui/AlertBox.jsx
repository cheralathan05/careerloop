import React from 'react';
import { XCircle, CheckCircle, AlertTriangle, Info } from 'lucide-react';

/**
 * @desc Reusable alert component for displaying status messages (e.g., non-toast feedback).
 */
export const AlertBox = ({ type = 'info', message, className = '' }) => {
    if (!message) return null;
    
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
    
    const { bg, border, text, icon: Icon } = styles[type] || styles.info;

    return (
        <div 
            className={`p-4 rounded-lg border-l-4 ${bg} ${border} shadow-sm flex items-start w-full ${className}`}
            role="alert"
        >
            <Icon className={`w-5 h-5 mr-3 flex-shrink-0 ${text}`} />
            <p className={`text-sm ${text} font-medium`}>
                {message}
            </p>
        </div>
    );
};