// src/components/loaders/OnboardingLoader.jsx

import React from 'react';

const OnboardingLoader = ({ message }) => {
    return (
        <div className="onboarding-loader-container">
            <div className="spinner"></div>
            <h3>{message || "Loading next step..."}</h3>
            <p>Please wait while the AI analyzes your profile.</p>
        </div>
    );
};

export default OnboardingLoader;