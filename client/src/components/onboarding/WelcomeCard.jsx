// src/components/onboarding/WelcomeCard.jsx

import React from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';

const WelcomeCard = ({ onStart }) => {
    return (
        <Card className="welcome-card-content">
            <img src="/illustrations/onboarding-welcome.svg" alt="Career Companion" className="hero-illustration" />
            <h1 className="hero-title">Welcome to CareerLoop 🚀</h1>
            <p className="tagline">Your **AI-powered career companion** is ready to build your personalized path.</p>
            
            <div className="feature-list">
                <p>Features include:</p>
                <ul>
                    <li>🤖 AI Assistant & Coaching</li>
                    <li>📊 Skill Tracking & Gap Analysis</li>
                    <li>🎤 Mock Interview Simulations</li>
                </ul>
            </div>
            
            <Button 
                onClick={onStart} 
                variant="primary"
                size="large"
            >
                Start Onboarding
            </Button>
        </Card>
    );
};

export default WelcomeCard;