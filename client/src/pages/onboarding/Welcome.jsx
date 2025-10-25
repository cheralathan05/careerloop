import React from 'react';
import { useOnboarding } from '../../hooks/useOnboarding'; // Fixed in step 19
import { useAuth } from '../../hooks/useAuth'; // Fixed in step 14
// FIX 1: Use the correct folder name 'layout' or 'layouts' as per your project structure.
// Assuming it's the singular 'layout' from your original image structure
import { OnboardingLayout } from '../../components/layout/OnboardingLayout'; 
import { WelcomeCard } from '../../components/onboarding/WelcomeCard';

/**
 * @desc Phase 1: Welcome screen to start the onboarding flow.
 * This component initializes the onboarding state with available user data.
 */
const WelcomePage = () => {
    // Get state management functions from our fixed hooks
    const { nextPhase, setOnboardingData } = useOnboarding();
    const { user } = useAuth(); // Get authenticated user's info

    const startOnboarding = () => {
        // Initialize details with user info before moving to next phase
        // Ensure you don't overwrite existing details if they were partially saved
        setOnboardingData('details', (prevDetails) => ({ 
            ...prevDetails, 
            // Only set if not already set, or if coming from Auth (e.g., Google login)
            fullName: prevDetails.fullName || user?.name || '',
            email: prevDetails.email || user?.email || '',
        }));
        
        nextPhase();
    };

    return (
        // The layout component provides the common header/progress bar structure
        <OnboardingLayout title="Welcome Aboard!">
            {/* Pass the start function to the child card component */}
            <WelcomeCard onStart={startOnboarding} />
        </OnboardingLayout>
    );
};

export default WelcomePage;
