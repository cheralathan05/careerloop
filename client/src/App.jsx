import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast'; // Global notifications

// --- Context Providers (All Fixed) ---
import { AuthProvider } from './context/AuthContext.jsx';
import { OnboardingProvider } from './context/OnboardingContext.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { AIProvider } from './context/AIContext.jsx';

// --- Fixed Components & Hooks ---
import { Navbar } from './components/layout/Navbar.jsx';
import { Footer } from './components/layout/Footer.jsx';
import { ProtectedRoute } from './routes/ProtectedRoute.jsx';
import  useAuth  from './hooks/useAuth.jsx'; 
import { useOnboarding } from './hooks/useOnboarding.jsx'; 
import { ONBOARDING_FLOW_MAP } from './utils/constants.js';

// --- Fixed Page Components ---
import Login from './pages/auth/Login.jsx';
import Signup from './pages/auth/Signup.jsx';
import VerifyOTP from './pages/auth/VerifyOTP.jsx';
import ForgotPassword from './pages/auth/ForgotPassword.jsx';
import ResetPassword from './pages/auth/ResetPassword.jsx';
import DashboardBeforeLogin from './pages/dashboard/DashboardBeforeLogin.jsx';
import DashboardHomePage from './pages/dashboard/DashboardHome.jsx';
import WelcomePage from './pages/onboarding/Welcome.jsx';
import UserDetailsFormPage from './pages/onboarding/UserDetailsForm.jsx';
import DomainSelectionPage from './pages/onboarding/DomainSelection.jsx';
import SkillAssessmentPage from './pages/onboarding/SkillAssessment.jsx';
import OnboardingSummaryPage from './pages/onboarding/OnboardingSummary.jsx';
import AIOnboardingAssistantPage from './pages/onboarding/AIOnboardingAssistant.jsx';
import TransitionToDashboardPage from './pages/onboarding/TransitionToDashboard.jsx';
import NotFound from './pages/NotFound.jsx';


// ---------------- App Router Wrapper (Handles Redirect Logic) ----------------
const AppRouterWrapper = () => {
    // Note: useAuth.loading should be used here, but App.jsx uses isAuthReady/user for flow.
    const { user, loading } = useAuth();
    const { onboardingState: { isComplete, currentPhase } } = useOnboarding();

    // Helper to calculate the correct dynamic redirect path
    const getRedirectPath = () => {
        if (!user) return '/login'; // Not authenticated
        if (isComplete) return '/dashboard'; // Fully onboarded

        // Find the current phase name and generate the path slug
        const currentStep = ONBOARDING_FLOW_MAP.find(step => step.phase === currentPhase);
        if (currentStep) {
            const pathSlug = currentStep.name.toLowerCase().replace(/\s/g, '');
            return `/onboarding/${pathSlug}`;
        }

        return '/onboarding/welcome'; // Fallback to start
    };
    
    // We can show a full screen loader based on the main auth loading state here
    // if (loading) return null; 

    return (
        <Routes>
            {/* Root redirect: Navigates to login, landing, or current onboarding step */}
            <Route path="/" element={<Navigate to={user ? getRedirectPath() : '/landing'} replace />} />

            {/* Public Routes */}
            <Route path="/landing" element={user ? <Navigate to={getRedirectPath()} replace /> : <DashboardBeforeLogin />} />
            <Route path="/login" element={user ? <Navigate to={getRedirectPath()} replace /> : <Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/verify-otp" element={<VerifyOTP />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* Protected Routes (Authenticated users only) */}
            <Route element={<ProtectedRoute />}>
                {/* Onboarding Flow (All paths are explicitly defined for clarity) */}
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

            {/* 404 Fallback */}
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
};


// ---------------- Main App Component ----------------
const App = () => {
    return (
        // Provider ordering is critical: Theme -> Auth -> Onboarding -> AI
        <ThemeProvider>
            <AuthProvider>
                <OnboardingProvider>
                    <AIProvider>
                        <Router>
                            {/* Outer layout wrapper ensures Nav/Footer appear on all pages */}
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

            {/* Global Toaster for fixed UI notifications */}
            <Toaster 
                position="top-right" 
                toastOptions={{ 
                    className: 'dark:bg-gray-700 dark:text-white',
                    style: { padding: '12px' }
                }}
            />
        </ThemeProvider>
    );
};

export default App;
