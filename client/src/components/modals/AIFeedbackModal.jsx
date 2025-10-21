// src/components/modals/AIFeedbackModal.jsx

import React from 'react';
import Button from '../ui/Button';

const AIFeedbackModal = ({ isOpen, onClose, summary }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-backdrop">
            <div className="modal-content">
                <h3>AI Assistant Session Summary</h3>
                <p>Thank you for using the AI Assistant! Here's a brief recap of your session:</p>
                <textarea readOnly value={summary} rows="6" />
                <div className="modal-actions">
                    <Button onClick={onClose} variant="primary">Close</Button>
                </div>
            </div>
        </div>
    );
};

export default AIFeedbackModal;