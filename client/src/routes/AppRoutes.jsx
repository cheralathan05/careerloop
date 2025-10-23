import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { useAuth } from '../hooks/useAuth'; 
import { useOnboarding } from '../hooks/useOnboarding';

// --- Auth Pages ---
import LoginPage from '../pages/auth/Login';
import SignupPage from '../pages/auth/Signup';
import VerifyOTPPage from '../pages/auth/VerifyOTP';
import ForgotPasswordPage from '../pages/auth/ForgotPassword';
import ResetPasswordPage from '../pages/auth/ResetPassword';

// --- Onboarding Pages (Protected) ---
import WelcomePage from '../pages/onboarding/Welcome';
import UserDetailsFormPage from '../pages/onboarding/UserDetailsForm';
import DomainSelectionPage from '../pages/onboarding/DomainSelection';
import SkillAssessmentPage from '../pages/onboarding/SkillAssessment';
import OnboardingSummaryPage from '../pages/onboarding/OnboardingSummary';
import AIOnboardingAssistantPage from '../pages/onboarding/AIOnboardingAssistant';
import TransitionToDashboardPage from '../pages/onboarding/TransitionToDashboard';

// --- Dashboard Pages (Protected) ---
import DashboardHomePage from '../pages/dashboard/DashboardHome';
import NotFound from '../pages/NotFound'; // Assuming a NotFound page exists

/**
 * @desc Defines all application routes, handling public access, protection,
 * and flow redirection (Login -> Onboarding -> Dashboard).
 */
export const AppRoutes = () => {
    const { user } = useAuth();
    const { onboardingState: { isComplete, currentPhase } } = useOnboarding();

    // Determine the starting point of the onboarding flow for authenticated users
    const onboardingStartPath = isComplete ? '/dashboard' : `/onboarding/${ONBOARDING_FLOW_MAP[currentPhase - 1]?.name.toLowerCase().replace(/\s/g, '') || 'welcome'}`;

    return (
        <Router>
            <Routes>
                {/* --- Public Routes --- */}
                <Route path="/" element={<Navigate to={user ? onboardingStartPath : '/login'} replace />} />
                <Route path="/login" element={user ? <Navigate to={onboardingStartPath} replace /> : <LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/verify-otp" element={<VerifyOTPPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                {/* Reset route often comes with a query parameter like /reset-password?token=... */}
                <Route path="/reset-password" element={<ResetPasswordPage />} /> 

                {/* --- Protected Routes --- */}
                <Route element={<ProtectedRoute />}>
                    {/* Onboarding Flow */}
                    <Route path="/onboarding/welcome" element={<WelcomePage />} />
                    <Route path="/onboarding/details" element={<UserDetailsFormPage />} />
                    <Route path="/onboarding/domains" element={<DomainSelectionPage />} />
                    <Route path="/onboarding/assessment" element={<SkillAssessmentPage />} />
                    <Route path="/onboarding/summary" element={<OnboardingSummaryPage />} />
                    <Route path="/onboarding/chat" element={<AIOnboardingAssistantPage />} />
                    <Route path="/onboarding/finish" element={<TransitionToDashboardPage />} />
                    
                    {/* Main Application */}
                    <Route path="/dashboard" element={<DashboardHomePage />} />
                </Route>

                {/* --- Fallback Route --- */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Router>
    );
};