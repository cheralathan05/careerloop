import React from 'react';
import { Loader2 } from 'lucide-react';

/**
 * @desc Reusable button component with variant, size, and loading states.
 */
export const Button = ({ 
    children, 
    onClick, 
    disabled = false, 
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
        outline: "bg-transparent border-indigo-600 text-indigo-600 hover:bg-indigo-50 dark:border-indigo-400 dark:text-indigo-400 dark:hover:bg-gray-800",
        danger: "bg-red-600 text-white border-transparent hover:bg-red-700 disabled:bg-red-400 dark:bg-red-500 dark:hover:bg-red-600",
    };

    const sizeStyles = {
        sm: "px-3 py-1.5 text-xs",
        md: "px-4 py-2 text-sm",
        lg: "px-6 py-3 text-base",
    };

    return (
        <button
            onClick={onClick}
            // Disable if explicitly disabled OR currently loading
            disabled={disabled || loading} 
            // Combine styles: base, variant, size, and any custom classes
            className={`${baseStyle} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
            {...props}
        >
            {loading ? (
                // Render loader if loading state is true
                <Loader2 className={`${children ? 'mr-2' : ''} ${iconSize} animate-spin flex-shrink-0`} />
            ) : (
                <>
                    {/* Render Icon if provided */}
                    {Icon && <Icon className={`${iconSize} ${children ? 'mr-2' : ''} flex-shrink-0`} />}
                    {/* Render text content */}
                    {children}
                </>
            )}
        </button>
    );
};
