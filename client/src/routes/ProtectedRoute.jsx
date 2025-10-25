import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useOnboarding } from '../hooks/useOnboarding';
import AuthLoader from '../components/loaders/AuthLoader';
import { ONBOARDING_FLOW_MAP } from '../utils/constants';

/**
 * @desc Protects routes, ensuring the user is authenticated and
 * redirects to the appropriate onboarding step if needed.
 */
export const ProtectedRoute = () => {
    const { user, isAuthReady, token } = useAuth();
    const { onboardingState: { isComplete, currentPhase } } = useOnboarding();

    // 1. Show a loader while auth status is being checked
    if (!isAuthReady) {
        return <AuthLoader />;
    }

    // 2. If user is not authenticated, redirect to login
    if (!user || !token) {
        return <Navigate to="/login" replace />;
    }

    // 3. If onboarding is incomplete, redirect to the correct step
    if (!isComplete) {
        const nextStep = ONBOARDING_FLOW_MAP[currentPhase - 1]?.name
            .toLowerCase()
            .replace(/\s/g, '') || 'welcome';
        return <Navigate to={`/onboarding/${nextStep}`} replace />;
    }

    // 4. Otherwise, render child routes
    return <Outlet />;
};
