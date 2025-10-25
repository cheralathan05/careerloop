import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth'; // <-- Correct: Getting the default export
import { useOnboarding } from '../hooks/useOnboarding';
import AuthLoader from '../components/loaders/AuthLoader';
import { ONBOARDING_FLOW_MAP } from '../utils/constants';

/**
 * @desc Protects routes, ensuring the user is authenticated and
 * redirects to the appropriate onboarding step if needed.
 */
export const ProtectedRoute = () => {
    // FIX/ENHANCEMENT: Use 'loading' (from the fixed useAuth.jsx) instead of 'isAuthReady'.
    // We assume the useAuth hook returns: { user, isAuthenticated, loading, ... }
    const { user, loading, isAuthenticated } = useAuth(); 
    const { onboardingState: { isComplete, currentPhase } } = useOnboarding();

    // 1. Show a loader while authentication status is being checked
    if (loading) {
        return <AuthLoader />;
    }

    // 2. If user is not authenticated (or token check fails), redirect to login
    // NOTE: isAuthenticated should cover the token check performed by useAuth
    if (!isAuthenticated || !user) { 
        return <Navigate to="/login" replace />;
    }

    // 3. If onboarding is incomplete, redirect to the correct step
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
