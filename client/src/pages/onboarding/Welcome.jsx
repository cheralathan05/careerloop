import React from 'react';
import useAuth from '../../hooks/useAuth'; // Corrected to two levels up (../..)
import { useOnboarding } from '../../hooks/useOnboarding'; 
import { OnboardingLayout } from '../../components/layout/OnboardingLayout';
import { WelcomeCard } from '../../components/onboarding/WelcomeCard';

/**
 * @desc Phase 1: Welcome screen to start the onboarding flow.
 */
const WelcomePage = () => {
    const { nextPhase, setOnboardingData } = useOnboarding();
    const { user } = useAuth(); // Now imported correctly

    const startOnboarding = () => {
        // Initialize details with user info before moving to next phase
        setOnboardingData('details', (prevDetails) => ({ 
            ...prevDetails, 
            fullName: prevDetails.fullName || user?.name || '',
            email: prevDetails.email || user?.email || '',
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