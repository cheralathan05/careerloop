import React from 'react';

/**
 * @desc Reusable card container for clean data display.
 * @param {React.ReactNode} children - Content inside the card.
 * @param {string} title - Optional title for the card header.
 * @param {string} className - Optional Tailwind class string for external styling.
 * @param {React.Component} titleIcon - Lucide icon component for the title.
 */
export const Card = ({ children, title, className = '', titleIcon: TitleIcon, ...props }) => {
    return (
        <div 
            // Apply standard theme-aware styling and merge with any custom classes
            className={`bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 ${className}`}
            {...props}
        >
            {title && (
                // Title display logic
                <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white flex items-center">
                    {/* Render TitleIcon if provided */}
                    {TitleIcon && <TitleIcon className="w-6 h-6 mr-3 flex-shrink-0 text-indigo-600 dark:text-indigo-400" />}
                    {title}
                </h2>
            )}
            {children}
        </div>
    );
};
