// src/components/ui/MultiSelect.jsx

import React from 'react';

const MultiSelect = ({ label, options, selected = [], onChange }) => {
    const handleTagClick = (option) => {
        if (selected.includes(option)) {
            onChange(selected.filter(item => item !== option));
        } else {
            onChange([...selected, option]);
        }
    };

    return (
        <div className="multi-select-group">
            <label>{label}</label>
            <div className="tags-container">
                {options.map(option => (
                    <span
                        key={option}
                        className={`select-tag ${selected.includes(option) ? 'selected' : ''}`}
                        onClick={() => handleTagClick(option)}
                    >
                        {option}
                    </span>
                ))}
            </div>
        </div>
    );
};

export default MultiSelect;