import React, { useEffect } from 'react'; // Added useEffect
import { X } from 'lucide-react';

/**
 * @desc Reusable modal wrapper component.
 * @param {boolean} isOpen - Controls visibility.
 * @param {function} onClose - Closes the modal.
 * @param {string} title - Title displayed in the modal header.
 * @param {React.ReactNode} children - Content inside the modal body.
 * @param {'sm' | 'md' | 'lg' | 'xl' | '2xl'} size - Max width of the modal content box.
 */
export const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
    
    // --- Side Effect: Lock body scroll ---
    // NOTE: This logic is redundant if handled by children, but included for robustness.
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);


    if (!isOpen) return null;

    const sizeClasses = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
        '2xl': 'max-w-2xl',
    };

    return (
        // Backdrop (Clicking here closes the modal)
        <div 
            className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-gray-900 bg-opacity-50 dark:bg-opacity-70"
            onClick={onClose}
            aria-modal="true"
            role="dialog"
        >
            {/* Modal Content Box */}
            <div 
                className={`bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full ${sizeClasses[size]} transform transition-all`}
                // CRITICAL FIX: Prevent closure when clicking inside the modal
                onClick={(e) => e.stopPropagation()} 
            >
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b dark:border-gray-700">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h3>
                    <button 
                        onClick={onClose} 
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
                        aria-label="Close modal"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>
                
                {/* Body Content */}
                <div className="p-6">
                    {children}
                </div>
            </div>
        </div>
    );
};
