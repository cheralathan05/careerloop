import { toast } from 'react-hot-toast'; // Assuming you use react-hot-toast

// Base style settings for all toasts
const BASE_OPTIONS = {
    duration: 3000,
    style: {
        borderRadius: '8px',
        color: '#fff', // White text for all custom backgrounds
        padding: '16px',
    },
};

/**
 * @desc Standardizes the display of success/error/info/warning alerts using a toast library.
 * This is the primary mechanism for giving non-blocking feedback to the user.
 * @param {string} message - The message text to display.
 * @param {'success' | 'error' | 'info' | 'warning'} type - The type of toast.
 */
export const showToast = (message, type = 'success') => {
    
    // Create a mutable copy of base options
    let options = { ...BASE_OPTIONS };

    switch (type) {
        case 'success':
            // Use dedicated function (green background, default by library)
            toast.success(message, options);
            break;

        case 'error':
            // Use dedicated function (red background, default by library)
            toast.error(message, options);
            break;

        case 'info':
            // FIX: Use generic toast and apply custom info style
            options.style.background = '#3B82F6'; // Tailwind blue-500
            toast(message, options);
            break;

        case 'warning':
            // FIX: Use 'warning' type for clarity (was 'warn') and apply custom warning style
            options.style.background = '#F59E0B'; // Tailwind amber-500
            toast(message, options);
            break;

        default:
            // Default to generic toast (can be customized further)
            options.style.background = '#6B7280'; // Tailwind gray-500
            toast(message, options);
    }
};
