// src/components/layout/OnboardingLayout.jsx

import React from 'react';
import useOnboarding from '../../hooks/useOnboarding';
import ProgressBar from '../onboarding/ProgressBar'; // Assume this component exists

const OnboardingLayout = ({ children }) => {
    const { state } = useOnboarding();
    
    // Calculate progress (simple example: 100% / 6 phases (5-10))
    const totalPhases = 6;
    const progressPercentage = Math.min(100, ((state.phase - 4) / totalPhases) * 100);

    return (
        <div className="onboarding-container">
            <header className="onboarding-header">
                {/* 

[Image of logo.png]
 */}
                <img src="/logo.png" alt="CareerLoop Logo" className="logo" />
                <ProgressBar percentage={progressPercentage} />
            </header>
            
            <main className="onboarding-content">
                {children}
            </main>

            <footer className="onboarding-footer">
                {/* Optional: Navigation links or copyright info */}
                <p>&copy; 2025 CareerLoop. Phase {state.phase} of 10.</p>
            </footer>
        </div>
    );
};

export default OnboardingLayout;