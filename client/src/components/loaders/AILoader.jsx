// src/components/loaders/AILoader.jsx

import React from 'react';

const AILoader = ({ message = 'AI is processing your request...' }) => {
    return (
        <div className="ai-loader-container">
            <div className="dots-container">
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
            </div>
            <p className="loader-message">{message}</p>
        </div>
    );
};

export default AILoader;