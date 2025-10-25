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
  const { user } = useAuth();
  const { onboardingState: { isComplete, currentPhase } } = useOnboarding();

  // Determine the correct onboarding step path
  const onboardingStartPath = isComplete
    ? '/dashboard'
    : `/onboarding/${ONBOARDING_FLOW_MAP[currentPhase - 1]?.name.toLowerCase().replace(/\s/g, '') || 'welcome'}`;

  return (
    <Router>
      <Routes>
        {/* --- Public Routes --- */}
        <Route path="/" element={<Navigate to={user ? onboardingStartPath : '/login'} replace />} />
        <Route path="/login" element={user ? <Navigate to={onboardingStartPath} replace /> : <LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/verify-otp" element={<VerifyOTPPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        {/* --- Protected Routes --- */}
        <Route element={<ProtectedRoute />}>

          {/* --- Onboarding Nested Routes --- */}
          <Route path="/onboarding" element={<OnboardingLayout />}>
            <Route path="welcome" element={<WelcomePage />} />
            <Route path="details" element={<UserDetailsFormPage />} />
            <Route path="domains" element={<DomainSelectionPage />} />
            <Route path="assessment" element={<SkillAssessmentPage />} />
            <Route path="summary" element={<OnboardingSummaryPage />} />
            <Route path="chat" element={<AIOnboardingAssistantPage />} />
            <Route path="finish" element={<TransitionToDashboardPage />} />
            <Route index element={<Navigate to="welcome" replace />} />
          </Route>

          {/* --- Dashboard Nested Routes --- */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardHomePage />} />
            {/* Add more dashboard subpages here as needed */}
          </Route>

        </Route>

        {/* --- Fallback Route --- */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};
