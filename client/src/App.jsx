import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast'; // For global notifications

// --- Context Providers ---
import { AuthProvider } from './context/AuthContext';
import { OnboardingProvider } from './context/OnboardingContext';
import { ThemeProvider } from './context/ThemeContext';
import { AIProvider } from './context/AIContext';

// --- Layout & Security ---
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { useAuth } from './hooks/useAuth'; 
import { useOnboarding } from './hooks/useOnboarding'; 
import { ONBOARDING_FLOW_MAP } from './utils/constants'; // Flow map for navigation logic

// --- Public Auth Pages ---
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import VerifyOTP from './pages/auth/VerifyOTP';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import DashboardBeforeLogin from './pages/dashboard/DashboardBeforeLogin'; 
import NotFound from './pages/NotFound';

// --- Protected Onboarding Pages ---
import WelcomePage from './pages/onboarding/Welcome';
import UserDetailsFormPage from './pages/onboarding/UserDetailsForm';
import DomainSelectionPage from './pages/onboarding/DomainSelection';
import SkillAssessmentPage from './pages/onboarding/SkillAssessment';
import OnboardingSummaryPage from './pages/onboarding/OnboardingSummary';
import AIOnboardingAssistantPage from './pages/onboarding/AIOnboardingAssistant';
import TransitionToDashboardPage from './pages/onboarding/TransitionToDashboard';

// --- Protected Dashboard Page ---
import DashboardHomePage from './pages/dashboard/DashboardHome';

// Component that wraps the router logic to use hooks
const AppRouterWrapper = () => {
    const { user, isAuthReady } = useAuth();
    // Assuming isComplete and currentPhase are exposed by useOnboarding
    const { onboardingState: { isComplete, currentPhase } } = useOnboarding();
    
    // Logic to determine the correct redirection path after login/verification
    const getRedirectPath = () => {
        if (!user || !isAuthReady) return '/login'; 
        
        if (isComplete) return '/dashboard'; 
        
        // Find the path corresponding to the current phase number
        const currentStep = ONBOARDING_FLOW_MAP.find(step => step.phase === currentPhase);
        if (currentStep) {
            // E.g., Phase 2, "User Details" -> "/onboarding/details"
            return `/onboarding/${currentStep.name.toLowerCase().replace(/\s/g, '')}`;
        }
        return '/onboarding/welcome'; 
    };

    return (
        <Routes>
            
            {/* Redirect root path based on authentication/onboarding status */}
            <Route path="/" element={<Navigate to={getRedirectPath()} replace />} />
            
            {/* --- Public Authentication Routes --- */}
            <Route path="/landing" element={<DashboardBeforeLogin />} /> 
            <Route path="/login" element={user ? <Navigate to={getRedirectPath()} replace /> : <Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/verify-otp" element={<VerifyOTP />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* --- Protected Routes --- */}
            <Route element={<ProtectedRoute />}>
                
                {/* Onboarding Flow Routes (Must be accessed sequentially) */}
                <Route path="/onboarding/welcome" element={<WelcomePage />} />
                <Route path="/onboarding/userdetails" element={<UserDetailsFormPage />} />
                <Route path="/onboarding/domainselection" element={<DomainSelectionPage />} />
                <Route path="/onboarding/skillassessment" element={<SkillAssessmentPage />} />
                <Route path="/onboarding/summaryreport" element={<OnboardingSummaryPage />} />
                <Route path="/onboarding/aiassistantchat" element={<AIOnboardingAssistantPage />} />
                <Route path="/onboarding/finish" element={<TransitionToDashboardPage />} />
                
                {/* Main Application Route */}
                <Route path="/dashboard" element={<DashboardHomePage />} />
            </Route>

            {/* 404 Catch-All Route */}
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}


const App = () => {
    return (
        <ThemeProvider>
            <AuthProvider>
                {/* Wrap Onboarding and AI context around the routing logic */}
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
