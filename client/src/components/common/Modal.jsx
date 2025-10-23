import React from 'react';
import { X } from 'lucide-react';

/**
 * @desc Reusable modal wrapper component.
 */
export const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
    if (!isOpen) return null;

    const sizeClasses = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
        '2xl': 'max-w-2xl',
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-gray-900 bg-opacity-50 dark:bg-opacity-70">
            <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full ${sizeClasses[size]} transform transition-all`}>
                <div className="flex justify-between items-center p-6 border-b dark:border-gray-700">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                        <X className="w-6 h-6" />
                    </button>
                </div>
                <div className="p-6">
                    {children}
                </div>
            </div>
        </div>
    );
};