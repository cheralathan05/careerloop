import React, { useEffect } from 'react';
import { useOnboarding } from '../../../hooks/useOnboarding';
import { useAuth } from '../../../hooks/useAuth';
import { DashboardPreviewLayout } from '../../../components/layout/DashboardPreviewLayout';
import { useNavigate } from 'react-router-dom';

/**
 * @desc Phase 7: Final screen confirming completion and transitioning to the dashboard.
 */
const TransitionToDashboardPage = () => {
    const { setOnboardingData } = useOnboarding();
    const { user } = useAuth();
    const navigate = useNavigate();

    // Logic to finalize onboarding in the client state
    const handleComplete = () => {
        // 1. Mark onboarding as permanently complete
        setOnboardingData('isComplete', true); 
        // 2. Clear sensitive data from context/cache if necessary
        
        // 3. Navigate
        navigate('/dashboard');
    };

    return (
        <DashboardPreviewLayout 
            user={user} 
            onComplete={handleComplete} 
        />
    );
};

export default TransitionToDashboardPage;