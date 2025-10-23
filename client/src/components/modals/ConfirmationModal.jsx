import React from 'react';
import { Button } from '../common/Button';
import { XCircle } from 'lucide-react';

/**
 * @typedef {object} ConfirmationModalProps
 * @property {boolean} isOpen - Controls the visibility of the modal.
 * @property {function} onClose - Function to call when the modal is closed (e.g., via Cancel button or backdrop click).
 * @property {function} onConfirm - Function to call when the 'Confirm' button is clicked.
 * @property {string} title - The title of the confirmation dialog.
 * @property {string} message - The main message asking for confirmation.
 * @property {string} confirmText - Text for the confirm button (default 'Confirm').
 * @property {string} cancelText - Text for the cancel button (default 'Cancel').
 * @property {boolean} isLoading - If true, shows a loading state on the confirm button.
 * @property {string} confirmButtonVariant - Tailwind CSS variant for the confirm button (default 'danger').
 */

/**
 * @desc Reusable confirmation modal for user actions.
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
    confirmButtonVariant = "danger" // Can be 'primary', 'danger', etc.
}) => {
    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 dark:bg-opacity-70 backdrop-blur-sm"
            aria-modal="true"
            role="dialog"
            aria-labelledby="confirmation-title"
            aria-describedby="confirmation-message"
            onClick={onClose} // Allows closing by clicking outside
        >
            <div 
                className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md transform transition-all duration-300 scale-100 opacity-100"
                onClick={e => e.stopPropagation()} // Prevent closing when clicking inside modal
            >
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

                <p id="confirmation-message" className="text-gray-700 dark:text-gray-300 mb-6">
                    {message}
                </p>

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
                        isLoading={isLoading} // Reuse Button's internal loading state
                    >
                        {confirmText}
                    </Button>
                </div>
            </div>
        </div>
    );
};