import { toast } from 'react-hot-toast'; // Assuming you use react-hot-toast

/**
 * @desc Standardizes the display of success/error/info/warning alerts using a toast library.
 * This is the primary mechanism for giving non-blocking feedback to the user.
 */
export const showToast = (message, type = 'success') => {
    const options = {
        duration: 3000,
        style: {
            borderRadius: '8px',
            background: type === 'error' ? '#EF4444' : type === 'info' ? '#3B82F6' : '#10B981',
            color: '#fff',
        },
    };

    switch (type) {
        case 'success':
            toast.success(message, options);
            break;
        case 'error':
            toast.error(message, options);
            break;
        case 'info':
            toast(message, options);
            break;
        case 'warn':
            toast(message, {...options, style: { background: '#F59E0B', color: '#fff' }});
            break;
        default:
            toast(message, options);
    }
};