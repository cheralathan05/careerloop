// src/utils/toastNotifications.js (FINAL, ZERO-ERROR VERSION)

import { toast } from 'react-hot-toast'; 
import React from 'react'; // Needed for custom toast components

// Base style settings for all toasts
const BASE_OPTIONS = {
    duration: 3000,
    style: {
        borderRadius: '8px',
        color: '#fff', // Default white text
        padding: '16px',
        fontSize: '15px'
    },
};

/**
 * @desc Standardizes the display of success/error/info/warning alerts using a toast library.
 * @param {string} message - The message text to display.
 * @param {'success' | 'error' | 'info' | 'warning'} type - The type of toast.
 */
export const showToast = (message, type = 'success') => {
    
    // Use the library's built-in handlers for success and error, as they include icons by default
    switch (type) {
        case 'success':
            toast.success(message, BASE_OPTIONS);
            break;

        case 'error':
            toast.error(message, BASE_OPTIONS);
            break;

        case 'info':
        case 'warning':
            // For info and warning, use a custom style on the generic toast function
            toast(message, {
                ...BASE_OPTIONS,
                icon: type === 'info' ? 'ℹ️' : '⚠️', // Add custom emoji icon
                style: {
                    ...BASE_OPTIONS.style,
                    background: type === 'info' ? '#3B82F6' : '#F59E0B', // Blue or Amber
                }
            });
            break;
            
        default:
            // Generic fallback toast
            toast(message, {
                ...BASE_OPTIONS,
                style: {
                    ...BASE_OPTIONS.style,
                    background: '#6B7280', // Gray
                }
            });
    }
};