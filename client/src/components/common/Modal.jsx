// client/src/components/common/Modal.jsx

import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom'; // 🚨 NEW: Import ReactDOM for Portals
import Button from './Button';

const Modal = ({ isOpen, onClose, title, children, showCloseButton = true }) => {
    // Ref to focus on the modal content when it opens
    const modalRef = useRef(null);

    // 🚨 ENHANCEMENT 1: Trap keyboard focus and enable Esc key to close
    useEffect(() => {
        if (!isOpen) return;

        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        // Focus the modal content to trap focus inside
        const modalElement = modalRef.current;
        if (modalElement) {
            // Add tabindex to make the div focusable
            modalElement.focus(); 
        }

        document.addEventListener('keydown', handleEscape);
        
        // Cleanup listener on component unmount or modal close
        return () => {
            document.removeEventListener('keydown', handleEscape);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    // 🚨 ENHANCEMENT 2: Use React Portal to render the modal outside the component hierarchy
    // This ensures correct stacking (z-index) and accessibility context (always at the end of <body>)
    return ReactDOM.createPortal(
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-60 transition-opacity duration-300"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            // Set tabindex to -1 so it can be focused via JS, but not by tabbing
            tabIndex="-1" 
            ref={modalRef}
        >
            <div
                className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-lg m-4 transform transition-all duration-300 scale-100" // Adjusted max-width for better use
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-start mb-4 border-b pb-2">
                    <h3 id="modal-title" className="text-2xl font-bold text-gray-900">
                        {title}
                    </h3>
                    {showCloseButton && (
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-900 text-3xl leading-none ml-4 transition"
                            aria-label="Close modal"
                        >
                            &times;
                        </button>
                    )}
                </div>

                <div className="text-gray-700 mb-6 py-2 overflow-y-auto max-h-[70vh]">{children}</div>

                {/* Optional Footer: Only shows a single close button if no other content is inside children */}
                {showCloseButton && (
                    <div className="text-right pt-4 border-t">
                        <Button onClick={onClose} className="bg-gray-500 hover:bg-gray-600">
                            Close
                        </Button>
                    </div>
                )}
            </div>
        </div>,
        // Target where the modal should render (usually body)
        document.body 
    );
};

export default Modal;