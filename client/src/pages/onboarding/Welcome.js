import React from 'react';
import { useOnboarding } from '../../../hooks/useOnboarding';
import { useAuth } from '../../../hooks/useAuth';
import { OnboardingLayout } from '../../../components/layout/OnboardingLayout';
import { WelcomeCard } from '../../../components/onboarding/WelcomeCard'; 

/**
 * @desc Phase 1: Welcome screen to start the flow.
 */
const WelcomePage = () => {
    const { nextPhase, setOnboardingData } = useOnboarding();
    const { user } = useAuth(); // Use useAuth to get user name/email

    const startOnboarding = () => {
        // Initialize basic details with authenticated user info before phase change
        setOnboardingData('details', prev => ({ 
            ...prev, 
            fullName: user?.name || '',
            email: user?.email,
        }));
        nextPhase();
    };

    return (
        <OnboardingLayout title="Welcome Aboard!">
            <WelcomeCard onStart={startOnboarding} />
        </OnboardingLayout>
    );
};

export default WelcomePage;