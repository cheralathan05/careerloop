import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { useAuth } from '../hooks/useAuth';
import { useOnboarding } from '../hooks/useOnboarding';
import { ONBOARDING_FLOW_MAP } from '../utils/constants';

// --- Auth Pages ---
import LoginPage from '../pages/auth/Login';
import SignupPage from '../pages/auth/Signup';
import VerifyOTPPage from '../pages/auth/VerifyOTP';
import ForgotPasswordPage from '../pages/auth/ForgotPassword';
import ResetPasswordPage from '../pages/auth/ResetPassword';

// --- Onboarding Layout & Pages ---
import OnboardingLayout from '../components/layouts/OnboardingLayout';
import WelcomePage from '../pages/onboarding/Welcome';
import UserDetailsFormPage from '../pages/onboarding/UserDetailsForm';
import DomainSelectionPage from '../pages/onboarding/DomainSelection';
import SkillAssessmentPage from '../pages/onboarding/SkillAssessment';
import OnboardingSummaryPage from '../pages/onboarding/OnboardingSummary';
import AIOnboardingAssistantPage from '../pages/onboarding/AIOnboardingAssistant';
import TransitionToDashboardPage from '../pages/onboarding/TransitionToDashboard';

// --- Dashboard Layout & Pages ---
import DashboardLayout from '../components/layouts/DashboardLayout';
import DashboardHomePage from '../pages/dashboard/DashboardHome';
import NotFound from '../pages/NotFound';

export const AppRoutes = () => {
    // Get global state from our fixed hooks
    const { user } = useAuth();
    const { onboardingState: { isComplete, currentPhase } } = useOnboarding();

    // Determine the correct onboarding step path for redirects
    const onboardingStartPath = React.useMemo(() => {
        if (isComplete) {
            return '/dashboard';
        }

        // Get the current step object (phase is 1-indexed, array is 0-indexed)
        const currentStep = ONBOARDING_FLOW_MAP[currentPhase - 1];

        // Ensure we have a valid step, otherwise default to 'welcome'
        if (currentStep && currentStep.name) {
            // CRITICAL ENHANCEMENT: Normalize the name exactly to the path slug
            const pathSlug = currentStep.name.toLowerCase().replace(/\s/g, '');
            return `/onboarding/${pathSlug}`;
        }
        
        // Fallback for an unhandled or initial state
        return '/onboarding/welcome'; 

    }, [isComplete, currentPhase]);


    return (
        <Router>
            <Routes>
                {/* --- Root Path Redirect --- */}
                <Route path="/" element={<Navigate to={user ? onboardingStartPath : '/login'} replace />} />

                {/* --- Public Auth Routes (Redirects if already authenticated) --- */}
                <Route path="/login" element={user ? <Navigate to={onboardingStartPath} replace /> : <LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/verify-otp" element={<VerifyOTPPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />

                {/* --- Protected Routes (Requires Authentication) --- */}
                <Route element={<ProtectedRoute />}>

                    {/* --- Onboarding Nested Routes (Handled by OnboardingLayout) --- */}
                    <Route path="/onboarding" element={<OnboardingLayout />}>
                        {/* NOTE: Paths are auto-generated from flow map names: */}
                        <Route path="welcome" element={<WelcomePage />} /> 
                        <Route path="userdetails" element={<UserDetailsFormPage />} /> 
                        <Route path="domainselection" element={<DomainSelectionPage />} /> 
                        <Route path="skillassessment" element={<SkillAssessmentPage />} /> 
                        <Route path="summaryreport" element={<OnboardingSummaryPage />} /> 
                        <Route path="aiassistantchat" element={<AIOnboardingAssistantPage />} /> 
                        <Route path="finish" element={<TransitionToDashboardPage />} /> 
                        
                        {/* Default /onboarding redirects to the current phase's path */}
                        <Route index element={<Navigate to={onboardingStartPath.replace('/onboarding/', '')} replace />} />
                    </Route>

                    {/* --- Dashboard Nested Routes (Handled by DashboardLayout) --- */}
                    <Route path="/dashboard" element={<DashboardLayout />}>
                        <Route index element={<DashboardHomePage />} />
                        {/* Add more dashboard subpages here */}
                    </Route>

                </Route>

                {/* --- Fallback Route --- */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Router>
    );
};
