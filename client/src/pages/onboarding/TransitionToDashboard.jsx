import React, { useEffect, useCallback } from 'react';
import { useOnboarding } from '../../hooks/useOnboarding'; // Fixed in step 19
import { useAuth } from '../../hooks/useAuth'; // Fixed in step 14
// FIX 1: Use the correct folder name 'layout' or 'layouts' as per your project structure.
import { DashboardPreviewLayout } from '../../components/layout/DashboardPreviewLayout'; 
import { useNavigate } from 'react-router-dom';
import { showToast } from '../../utils/toastNotifications';

/**
 * @desc Phase 7: Final screen confirming completion and transitioning to the dashboard.
 * This component handles the client-side finalization of the onboarding process.
 */
const TransitionToDashboardPage = () => {
    const { setOnboardingData } = useOnboarding();
    const { user } = useAuth();
    const navigate = useNavigate();

    // Logic to finalize onboarding in the client state
    const handleComplete = useCallback(() => {
        // Mark onboarding as permanently complete in context
        setOnboardingData('isComplete', true); 
        
        // Show a celebratory message
        showToast(`Welcome to your CareerLoop Dashboard, ${user?.name || 'User'}!`, 'success');

        // Navigate to dashboard
        navigate('/dashboard', { replace: true });
    }, [setOnboardingData, navigate, user?.name]);

    // ENHANCEMENT: Use useEffect to automatically finalize and transition
    useEffect(() => {
        // Allow the user to see the "summary" for a moment (e.g., 2 seconds)
        const timer = setTimeout(() => {
            handleComplete();
        }, 2000); 

        // Cleanup the timer if the component unmounts early
        return () => clearTimeout(timer);
    }, [handleComplete]);

    // The layout component provides the visual presentation of the final summary/preview
    return (
        <DashboardPreviewLayout 
            user={user} 
            // In the enhanced version, the button inside the layout will trigger the navigation instantly
            onComplete={handleComplete} 
        />
    );
};

export default TransitionToDashboardPage;

