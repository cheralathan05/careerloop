import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth'; 
import { useOnboarding } from '../hooks/useOnboarding'; // CRITICAL: Required for flow enforcement
import AuthLoader from '../components/loaders/AuthLoader';
import { ONBOARDING_FLOW_MAP } from '../utils/constants';

/**
 * @desc Protects routes, ensuring the user is authenticated and
 * redirects to the appropriate onboarding step if needed.
 */
export const ProtectedRoute = () => {
    // FIX: Use 'loading' (from the fixed useAuth.jsx) for the initial check.
    const { user, loading, isAuthenticated } = useAuth(); 
    // CRITICAL: Get onboarding state to enforce the flow
    const { onboardingState: { isComplete, currentPhase } } = useOnboarding();

    // 1. Show a loader while authentication status is being checked
    if (loading) {
        return <AuthLoader />;
    }

    // 2. If user is NOT authenticated, redirect to login
    if (!isAuthenticated || !user) { 
        return <Navigate to="/login" replace />;
    }

    // 3. If onboarding is INCOMPLETE, redirect to the correct step
    // NOTE: This logic prevents users from accessing /dashboard prematurely.
    if (!isComplete) {
        // Find the step name corresponding to the current phase (1-indexed)
        const currentStep = ONBOARDING_FLOW_MAP[currentPhase - 1];
        
        // Safely determine the next path slug (must match AppRoutes.jsx paths)
        const nextPathSlug = currentStep 
            ? currentStep.name.toLowerCase().replace(/\s/g, '') 
            : 'welcome';
            
        // Redirect to /onboarding/pathslug
        return <Navigate to={`/onboarding/${nextPathSlug}`} replace />;
    }

    // 4. Otherwise, user is authenticated and onboarded; render child routes
    return <Outlet />;
};

export default ProtectedRoute;
