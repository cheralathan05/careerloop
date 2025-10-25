import React from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { TrendingUp, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * @desc Layout wrapper for the final onboarding step,
 * providing a teaser of the personalized dashboard.
 */
export const DashboardPreviewLayout = ({ user, onComplete }) => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center p-4">
            <Card 
                title="Your CareerLoop Launchpad" 
                className="w-full max-w-4xl shadow-2xl text-center"
            >
                <h2 className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400 mb-6">
                    Congratulations, {user?.name || 'Explorer'}!
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-10">
                    Your <strong>AI-powered career path</strong> is ready. Here's a glimpse of your personalized dashboard.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    {/* Top Recommended Domain */}
                    <Card 
                        title="Top Recommended Domain" 
                        titleIcon={TrendingUp} 
                        className="bg-green-50 dark:bg-green-900/20"
                    >
                        <p className="text-xl font-bold text-green-700 dark:text-green-300">Web Development</p>
                        <p className="text-sm text-gray-500 mt-1">Score: 85% Match</p>
                    </Card>

                    {/* Immediate Next Task */}
                    <Card title="Immediate Next Task" titleIcon={Users}>
                        <p className="text-gray-800 dark:text-gray-200 font-medium">
                            Build a minimum viable portfolio project.
                        </p>
                        <p className="text-sm text-gray-500 mt-1">Priority: High</p>
                    </Card>

                    {/* Skill Gap */}
                    <Card title="Skill Gap" titleIcon={TrendingUp}>
                        <p className="text-gray-800 dark:text-gray-200 font-medium">
                            Node.js API security
                        </p>
                        <p className="text-sm text-gray-500 mt-1">Recommended course: 1</p>
                    </Card>
                </div>

                <Button
                    onClick={() => {
                        onComplete(); // Mark onboarding as complete
                        navigate('/dashboard'); 
                    }}
                    size="lg"
                    className="w-full md:w-auto"
                >
                    Go to Full Dashboard
                </Button>
            </Card>
        </div>
    );
};
