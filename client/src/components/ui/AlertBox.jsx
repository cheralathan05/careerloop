// src/components/ui/AlertBox.jsx

import React from 'react';

const AlertBox = ({ type = 'info', message, onClose }) => {
    if (!message) return null;

    // Maps type to icon and CSS class
    const iconMap = {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️'
    };

    return (
        <div className={`alert-box alert-${type}`}>
            <span className="alert-icon">{iconMap[type]}</span>
            <p className="alert-message">{message}</p>
            {onClose && (
                <button onClick={onClose} className="alert-close-btn">
                    &times;
                </button>
            )}
        </div>
    );
};

export default AlertBox;