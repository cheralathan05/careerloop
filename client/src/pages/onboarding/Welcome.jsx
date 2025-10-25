import React from 'react';
import { useOnboarding } from '../../hooks/useOnboarding';
import { useAuth } from '../../hooks/useAuth';
import { OnboardingLayout } from '../../components/layout/OnboardingLayout';
import { WelcomeCard } from '../../components/onboarding/WelcomeCard';

/**
 * @desc Phase 1: Welcome screen to start the onboarding flow.
 */
const WelcomePage = () => {
    const { nextPhase, setOnboardingData } = useOnboarding();
    const { user } = useAuth(); // Get authenticated user's info

    const startOnboarding = () => {
        // Initialize details with user info before moving to next phase
        setOnboardingData('details', prev => ({ 
            ...prev, 
            fullName: user?.name || '',
            email: user?.email || '',
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
