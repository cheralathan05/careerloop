import React, { useEffect } from 'react';
import { Button } from '../common/Button'; // Fixed component
import { XCircle } from 'lucide-react';

/**
 * @desc Reusable confirmation modal for user actions with optional loading and keyboard support.
 * @param {boolean} isOpen - Controls visibility.
 * @param {function} onClose - Closes the modal.
 * @param {function} onConfirm - Function executed when the user confirms the action.
 */
export const ConfirmationModal = ({
    isOpen,
    onClose,
    onConfirm,
    title = "Confirm Action",
    message = "Are you sure you want to proceed with this action?",
    confirmText = "Confirm",
    cancelText = "Cancel",
    isLoading = false,
    confirmButtonVariant = "danger",
}) => {

    // --- Side Effect: Lock body scroll & Keyboard Handling (Escape/Enter) ---
    useEffect(() => {
        // Lock body scroll
        if (isOpen) document.body.style.overflow = 'hidden';
        else document.body.style.overflow = '';
        
        // Keyboard Handling
        const handleKey = (e) => {
            if (!isOpen) return;
            if (e.key === 'Escape') onClose?.();
            // Prevents accidental double-submission or form submission if confirmed
            if (e.key === 'Enter' && onConfirm) {
                 e.preventDefault(); 
                 onConfirm();
            }
        };
        window.addEventListener('keydown', handleKey);
        
        // Cleanup function
        return () => { 
            document.body.style.overflow = ''; 
            window.removeEventListener('keydown', handleKey);
        };
    }, [isOpen, onClose, onConfirm]);

    if (!isOpen) return null;

    // --- Render ---
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 dark:bg-opacity-70 backdrop-blur-sm"
            aria-modal="true"
            role="dialog"
            aria-labelledby="confirmation-title"
            aria-describedby="confirmation-message"
            onClick={onClose} // Close on backdrop click
        >
            <div
                className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md transform transition-all duration-300 scale-100 opacity-100"
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
            >
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                    <h3 id="confirmation-title" className="text-xl font-bold text-gray-900 dark:text-white">
                        {title}
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
                        aria-label="Close"
                    >
                        <XCircle className="w-6 h-6" />
                    </button>
                </div>

                {/* Message */}
                <p id="confirmation-message" className="text-gray-700 dark:text-gray-300 mb-6">
                    {message}
                </p>

                {/* Footer Buttons */}
                <div className="flex justify-end space-x-3">
                    <Button
                        variant="secondary"
                        onClick={onClose}
                        disabled={isLoading}
                    >
                        {cancelText}
                    </Button>
                    <Button
                        variant={confirmButtonVariant}
                        onClick={onConfirm}
                        // NOTE: Button component automatically handles 'loading' state
                        loading={isLoading} 
                    >
                        {confirmText}
                    </Button>
                </div>
            </div>
        </div>
    );
};
