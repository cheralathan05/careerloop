// src/pages/onboarding/Welcome.js

import React from 'react';
import useOnboarding from '../../hooks/useOnboarding';
import OnboardingLayout from '../../components/layout/OnboardingLayout';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

const Welcome = () => {
    const { nextPhase } = useOnboarding();

    const handleStartOnboarding = () => {
        // System Action: Initialize session and move to the next phase (6)
        nextPhase(); 
        // NOTE: In a real app, navigation (e.g., useNavigate) would handle the route change
        // For simplicity with the OnboardingLayout structure, we'll assume the router navigates based on the phase state change.
    };

    return (
        <OnboardingLayout>
            <Card className="welcome-card">
                <img src="/illustrations/onboarding-welcome.svg" alt="Welcome" className="illustration" />
                <h1>Welcome to CareerLoop 👋</h1>
                <p className="tagline">Your **AI-powered career companion** is ready to build your personalized path.</p>
                <div className="feature-highlights">
                    <ul>
                        <li>✨ AI-Driven Skill Tracking</li>
                        <li>🤖 Personalized Career Coaching</li>
                        <li>💡 Mock Interview Simulations</li>
                    </ul>
                </div>
                
                <Button 
                    onClick={handleStartOnboarding} 
                    variant="primary"
                    size="large"
                >
                    Start Onboarding
                </Button>
            </Card>
        </OnboardingLayout>
    );
};

export default Welcome;