// client/src/components/common/Modal.jsx

import React from 'react';
import Button from './Button';

const Modal = ({ isOpen, onClose, title, children, showCloseButton = true }) => {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
        >
            <div
                className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-sm m-4"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-start mb-4">
                    <h3 id="modal-title" className="text-xl font-semibold text-gray-900">
                        {title}
                    </h3>
                    {showCloseButton && (
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
                            aria-label="Close modal"
                        >
                            &times;
                        </button>
                    )}
                </div>

                <div className="text-gray-700 mb-6">{children}</div>

                {showCloseButton && (
                    <div className="text-right">
                        <Button onClick={onClose}>Close</Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Modal;
