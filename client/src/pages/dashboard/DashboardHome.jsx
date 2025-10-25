import React, { useEffect, useMemo } from 'react'; // Added useMemo
import { useAuth } from '../../hooks/useAuth'; // Fixed in step 14
import { useOnboarding } from '../../hooks/useOnboarding'; // Fixed in step 19
// Removed unused import: import { DashboardPreviewLayout } from '../../components/layout/DashboardPreviewLayout';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { TrendingUp, Users, AlertTriangle } from 'lucide-react'; // Added AlertTriangle
import { useNavigate } from 'react-router-dom';
import { AlertBox } from '../../components/ui/AlertBox'; // Added AlertBox

/**
 * @desc Main dashboard for authenticated users after completing onboarding.
 */
const DashboardHome = () => {
    const { user } = useAuth();
    const { onboardingState, prevPhase } = useOnboarding(); // Added prevPhase for safe access
    const navigate = useNavigate();
    
    // Destructure properties needed for flow enforcement
    const { isComplete } = onboardingState;

    // --- Flow Enforcement ---
    useEffect(() => {
        // If the user lands here but the context is not marked complete, 
        // redirect them back to the start of the flow to prevent issues.
        if (!isComplete) {
            // Use replace to prevent the user from backing into this page immediately
            navigate(`/onboarding/welcome`, { replace: true });
        }
    }, [isComplete, navigate]);
    
    // --- Data Extraction (Mimic real API data based on summary) ---
    const dashboardData = useMemo(() => {
        // In a real app, this would be an API call, but here we pull from context summary
        const summary = onboardingState.summary;
        if (!summary) return null;

        // Extract key pieces from the summary (defaults for presentation)
        const topDomain = summary.recommendedDomains?.[0]?.name || 'Web Development';
        const topDomainScore = summary.recommendedDomains?.[0]?.score || 85;
        const nextTask = summary.recommendedTasks?.[0] || 'Build a personal portfolio website.';
        const skillGaps = summary.skillGaps?.[0] || 'Node.js API security';
        
        return { topDomain, topDomainScore, nextTask, skillGaps };
    }, [onboardingState.summary]);


    // --- Early Exit for Redirect/Incomplete State ---
    if (!isComplete || !dashboardData) {
        // Render a minimal loader/message while the redirect or data fetching occurs
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <AlertBox type="info" message="Loading dashboard data..." />
            </div>
        );
    }
    
    // Destructure the memoized data
    const { topDomain, topDomainScore, nextTask, skillGaps } = dashboardData;

    // --- Main Render ---
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-8">
            <h1 className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400 mb-6">
                Welcome back, {user?.name || 'Explorer'}!
            </h1>

            {/* Main Insights Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card title="Top Recommended Domain" titleIcon={TrendingUp} className="bg-green-50 dark:bg-green-900/20">
                    <p className="text-xl font-bold text-green-700 dark:text-green-300">{topDomain}</p>
                    <p className="text-sm text-gray-500 mt-1">Score: {topDomainScore}% Match</p>
                </Card>

                <Card title="Immediate Next Task" titleIcon={Users}>
                    <p className="text-gray-800 dark:text-gray-200 font-medium">{nextTask}</p>
                    <p className="text-sm text-gray-500 mt-1">Priority: High</p>
                </Card>

                <Card title="Skill Gap" titleIcon={AlertTriangle}>
                    <p className="text-gray-800 dark:text-gray-200 font-medium">{skillGaps}</p>
                    <p className="text-sm text-gray-500 mt-1">Recommended course: 1</p>
                </Card>
            </div>

            {/* AI Assistant CTA */}
            <div className="mt-10 flex justify-center">
                <Button 
                    onClick={() => navigate('/onboarding/aiassistantchat')}
                    size="lg"
                    className="w-full md:w-auto"
                    variant="primary"
                >
                    Talk to AI Assistant
                </Button>
            </div>
            
            {/* Optional: Full Layout Preview (if DashboardLayout is not implemented yet) */}
            {/* If you are using DashboardLayout as the parent route, this area is typically reserved for children */}
        </div>
    );
};

export default DashboardHome;
