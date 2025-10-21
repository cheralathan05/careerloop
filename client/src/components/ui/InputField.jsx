// src/components/ui/InputField.jsx

import React from 'react';

const InputField = ({ label, name, value, onChange, type = 'text', error, ...props }) => (
    <div className="input-field-group">
        <label htmlFor={name}>{label}</label>
        <input 
            id={name}
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            className={error ? 'input-error' : ''}
            {...props}
        />
        {error && <p className="error-message">{error}</p>}
    </div>
);

export default InputField;