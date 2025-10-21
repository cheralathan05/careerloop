// src/components/ui/Button.jsx

import React from 'react';

const Button = ({ children, onClick, variant = 'default', size = 'medium', disabled = false, className = '' }) => {
    // Maps props to CSS classes for styling (e.g., 'btn-primary', 'btn-large', etc.)
    const classNames = `btn btn-${variant} btn-${size} ${className} ${disabled ? 'btn-disabled' : ''}`;

    return (
        <button 
            className={classNames} 
            onClick={onClick} 
            disabled={disabled}
        >
            {children}
        </button>
    );
};

export default Button;