import React, { useEffect } from 'react';
import { Button } from '../common/Button'; // Assuming common Button is used
import { Sparkles, XCircle } from 'lucide-react';
import Markdown from 'react-markdown';

/**
 * @typedef {object} AIResponseModalProps
 * @property {boolean} isOpen - Controls the visibility of the modal.
 * @property {function} onClose - Function to close the modal.
 * @property {string} title - Title of the AI response (e.g., "AI Task Detail").
 * @property {string} content - The main AI-generated content, often in Markdown.
 * @property {React.ReactNode} [footerActions] - Optional JSX to display action buttons in the footer.
 * @property {boolean} [isLoading] - If the content itself is still loading.
 */

/**
 * @desc Modal for displaying detailed AI-generated responses with optional footer actions.
 */
export const AIResponseModal = ({
    isOpen,
    onClose,
    title = "AI Insight",
    content,
    footerActions,
    isLoading = false,
}) => {
    // --- Side Effect: Control Body Scroll ---
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        // Cleanup function to restore scroll on unmount
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    // Render nothing if closed
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 dark:bg-opacity-70 backdrop-blur-sm"
            aria-modal="true"
            role="dialog"
            aria-labelledby="ai-response-title"
            // Close the modal if the backdrop is clicked
            onClick={onClose} 
        >
            <div
                // Modal content box
                className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-100 opacity-100"
                // Stop click propagation to prevent closing on internal click
                onClick={(e) => e.stopPropagation()} 
            >
                {/* Header */}
                <div className="flex justify-between items-center pb-4 border-b border-gray-200 dark:border-gray-700 mb-4">
                    <h3
                        id="ai-response-title"
                        className="text-2xl font-bold text-gray-900 dark:text-white flex items-center"
                    >
                        <Sparkles className="w-6 h-6 text-indigo-500 mr-2 flex-shrink-0" />
                        {title}
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
                        aria-label="Close"
                    >
                        <XCircle className="w-7 h-7" />
                    </button>
                </div>

                {/* Content Area */}
                <div className="text-gray-700 dark:text-gray-300 prose dark:prose-invert max-w-none text-base">
                    {isLoading ? (
                        <div className="flex justify-center items-center h-48">
                            <Sparkles className="w-8 h-8 text-indigo-500 animate-pulse mr-2" />
                            <span className="text-lg font-medium">Generating content...</span>
                        </div>
                    ) : (
                        // Render markdown content
                        <Markdown>{content}</Markdown>
                    )}
                </div>

                {/* Footer Actions */}
                {footerActions && (
                    <div className="pt-4 mt-6 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3">
                        {footerActions}
                    </div>
                )}
            </div>
        </div>
    );
};

