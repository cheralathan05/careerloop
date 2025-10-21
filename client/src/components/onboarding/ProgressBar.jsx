// src/components/onboarding/ProgressBar.jsx

import React from 'react';

const ProgressBar = ({ percentage }) => {
    return (
        <div className="progress-bar-container">
            <div 
                className="progress-bar-fill" 
                style={{ width: `${percentage}%` }}
                role="progressbar"
                aria-valuenow={percentage}
                aria-valuemin="0"
                aria-valuemax="100"
            >
                <span className="progress-text">{Math.round(percentage)}%</span>
            </div>
        </div>
    );
};

export default ProgressBar;