import React, { useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useOnboarding } from '../../hooks/useOnboarding';
import { DashboardPreviewLayout } from '../../components/layout/DashboardPreviewLayout';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { TrendingUp, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * @desc Main dashboard for authenticated users after completing onboarding.
 */
const DashboardHome = () => {
    const { user } = useAuth();
    const { onboardingState } = useOnboarding();
    const navigate = useNavigate();

    useEffect(() => {
        // Redirect user to onboarding if they haven't completed it
        if (!onboardingState.isComplete) {
            navigate(`/onboarding/welcome`);
        }
    }, [onboardingState.isComplete, navigate]);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-8">
            <h1 className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400 mb-6">
                Welcome back, {user?.name || 'Explorer'}!
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card title="Top Recommended Domain" titleIcon={TrendingUp} className="bg-green-50 dark:bg-green-900/20">
                    <p className="text-xl font-bold text-green-700 dark:text-green-300">Web Development</p>
                    <p className="text-sm text-gray-500 mt-1">Score: 85% Match</p>
                </Card>

                <Card title="Immediate Next Task" titleIcon={Users}>
                    <p className="text-gray-800 dark:text-gray-200 font-medium">Build a minimum viable portfolio project.</p>
                    <p className="text-sm text-gray-500 mt-1">Priority: High</p>
                </Card>

                <Card title="Skill Gap" titleIcon={TrendingUp}>
                    <p className="text-gray-800 dark:text-gray-200 font-medium">Node.js API security</p>
                    <p className="text-sm text-gray-500 mt-1">Recommended course: 1</p>
                </Card>
            </div>

            <div className="mt-10 flex justify-center">
                <Button 
                    onClick={() => navigate('/onboarding/aiassistantchat')}
                    size="lg"
                    className="w-full md:w-auto"
                >
                    Talk to AI Assistant
                </Button>
            </div>
        </div>
    );
};

export default DashboardHome;
