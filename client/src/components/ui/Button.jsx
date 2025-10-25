import React from 'react';
import { Loader2 } from 'lucide-react';

/**
 * @desc Reusable button component with variant, size, and loading states.
 * @param {boolean} loading - Displays a spinner and disables the button if true.
 * @param {'primary' | 'secondary' | 'outline' | 'danger'} variant - Color scheme.
 * @param {'sm' | 'md' | 'lg'} size - Padding and text size.
 * @param {React.Component} icon - Lucide icon component to display on the left.
 */
export const Button = ({ 
    children, 
    loading = false, 
    variant = 'primary', 
    size = 'md',
    icon: Icon, 
    className = '', 
    ...props 
}) => {
    // Determine icon size based on button size for visual consistency
    const iconSize = size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'; 

    const baseStyle = "font-semibold rounded-lg shadow-md transition duration-150 ease-in-out flex items-center justify-center border";
    
    // NOTE: Dark mode classes are essential here for theme compatibility
    const variantStyles = {
        primary: "bg-indigo-600 text-white border-transparent hover:bg-indigo-700 disabled:bg-indigo-400 dark:bg-indigo-500 dark:hover:bg-indigo-600",
        secondary: "bg-gray-200 text-gray-800 border-gray-300 hover:bg-gray-300 disabled:bg-gray-100 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600",
        outline: "bg-transparent border-indigo-600 text-indigo-600 hover:bg-indigo-50 disabled:border-gray-400 dark:border-indigo-400 dark:text-indigo-400 dark:hover:bg-gray-800",
        danger: "bg-red-600 text-white border-transparent hover:bg-red-700 disabled:bg-red-400 dark:bg-red-500 dark:hover:bg-red-600",
    };

    const sizeStyles = {
        sm: "px-3 py-1.5 text-xs",
        md: "px-4 py-2 text-sm",
        lg: "px-6 py-3 text-base",
    };

    return (
        <button
            disabled={props.disabled || loading}
            // Combine styles: base, variant, size, and any custom classes
            className={`${baseStyle} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
            {...props}
        >
            {loading ? (
                // FIX: Ensure loader is sized consistently (5 for lg, 4 for others) and centered.
                <Loader2 className={`${children ? 'mr-2' : ''} ${iconSize} animate-spin`} />
            ) : (
                <>
                    {/* Render Icon if provided */}
                    {Icon && <Icon className={`${iconSize} ${children ? 'mr-2' : ''}`} />}
                    {/* Render text content */}
                    {children}
                </>
            )}
        </button>
    );
};

