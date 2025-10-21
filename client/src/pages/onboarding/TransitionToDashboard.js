// src/pages/onboarding/TransitionToDashboard.js

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardPreviewLayout from '../../components/layout/DashboardPreviewLayout';
import OnboardingLoader from '../../components/loaders/OnboardingLoader';

const TransitionToDashboard = () => {
    const navigate = useNavigate();
    
    // Simulate final processing and smooth transition
    useEffect(() => {
        const timer = setTimeout(() => {
            // After a short delay, redirect to the main Dashboard page
            navigate('/dashboard', { replace: true });
        }, 3000); // 3-second delay for a smooth transition animation

        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <DashboardPreviewLayout>
            <OnboardingLoader message="Finalizing your personalized dashboard..." />
            {/* Display a preview illustration or a smooth animation */}
            <p>You're all set! Loading your AI-powered career hub...</p>
        </DashboardPreviewLayout>
    );
};

export default TransitionToDashboard;