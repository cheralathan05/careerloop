// client/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast'; // Global notifications

// --- Context Providers ---
import { AuthProvider } from './context/AuthContext.jsx';
import { OnboardingProvider } from './context/OnboardingContext.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { AIProvider } from './context/AIContext.jsx';

// --- Layout & Security ---
import { Navbar } from './components/layout/Navbar.jsx';
import { Footer } from './components/layout/Footer.jsx';
import { ProtectedRoute } from './routes/ProtectedRoute.jsx';
import { useAuth } from './hooks/useAuth.jsx'; 
import { useOnboarding } from './hooks/useOnboarding.jsx'; 
import { ONBOARDING_FLOW_MAP } from './utils/constants.js'; // Flow map for onboarding navigation

// --- Public Auth Pages ---
import Login from './pages/auth/Login.jsx';
import Signup from './pages/auth/Signup.jsx';
import VerifyOTP from './pages/auth/VerifyOTP.jsx';
import ForgotPassword from './pages/auth/ForgotPassword.jsx';
import ResetPassword from './pages/auth/ResetPassword.jsx';

// --- Dashboard Pages ---
import DashboardBeforeLogin from './pages/dashboard/DashboardBeforeLogin.jsx';
import DashboardHomePage from './pages/dashboard/DashboardHome.jsx';

// --- Onboarding Pages ---
import WelcomePage from './pages/onboarding/Welcome.jsx';
import UserDetailsFormPage from './pages/onboarding/UserDetailsForm.jsx';
import DomainSelectionPage from './pages/onboarding/DomainSelection.jsx';
import SkillAssessmentPage from './pages/onboarding/SkillAssessment.jsx';
import OnboardingSummaryPage from './pages/onboarding/OnboardingSummary.jsx';
import AIOnboardingAssistantPage from './pages/onboarding/AIOnboardingAssistant.jsx';
import TransitionToDashboardPage from './pages/onboarding/TransitionToDashboard.jsx';

// --- 404 Page ---
import NotFound from './pages/NotFound.jsx';


// ---------------- App Router Wrapper ----------------
const AppRouterWrapper = () => {
    const { user, isAuthReady } = useAuth();
    const { onboardingState: { isComplete, currentPhase } } = useOnboarding();

    const getRedirectPath = () => {
        if (!user || !isAuthReady) return '/login';
        if (isComplete) return '/dashboard';

        const currentStep = ONBOARDING_FLOW_MAP.find(step => step.phase === currentPhase);
        if (currentStep) {
            return `/onboarding/${currentStep.name.toLowerCase().replace(/\s/g, '')}`;
        }

        return '/onboarding/welcome';
    };

    return (
        <Routes>
            {/* Root redirect */}
            <Route path="/" element={<Navigate to={getRedirectPath()} replace />} />

            {/* Public Routes */}
            <Route path="/landing" element={<DashboardBeforeLogin />} />
            <Route path="/login" element={user ? <Navigate to={getRedirectPath()} replace /> : <Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/verify-otp" element={<VerifyOTP />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
                {/* Onboarding Flow */}
                <Route path="/onboarding/welcome" element={<WelcomePage />} />
                <Route path="/onboarding/userdetails" element={<UserDetailsFormPage />} />
                <Route path="/onboarding/domainselection" element={<DomainSelectionPage />} />
                <Route path="/onboarding/skillassessment" element={<SkillAssessmentPage />} />
                <Route path="/onboarding/summaryreport" element={<OnboardingSummaryPage />} />
                <Route path="/onboarding/aiassistantchat" element={<AIOnboardingAssistantPage />} />
                <Route path="/onboarding/finish" element={<TransitionToDashboardPage />} />

                {/* Dashboard */}
                <Route path="/dashboard" element={<DashboardHomePage />} />
            </Route>

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
};


// ---------------- Main App Component ----------------
const App = () => {
    return (
        <ThemeProvider>
            <AuthProvider>
                <OnboardingProvider>
                    <AIProvider>
                        <Router>
                            <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
                                <Navbar />
                                <main className="flex-grow">
                                    <AppRouterWrapper />
                                </main>
                                <Footer />
                            </div>
                        </Router>
                    </AIProvider>
                </OnboardingProvider>
            </AuthProvider>

            <Toaster 
                position="top-right" 
                toastOptions={{ className: 'dark:bg-gray-700 dark:text-white' }}
            />
        </ThemeProvider>
    );
};

export default App;
