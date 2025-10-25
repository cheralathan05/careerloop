import React from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { TrendingUp, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * @desc Layout wrapper for the final onboarding step,
 * providing a teaser of the personalized dashboard.
 * @param {object} user - The authenticated user object.
 * @param {function} onComplete - Function to call to finalize the onboarding state.
 */
export const DashboardPreviewLayout = ({ user, onComplete }) => {
    const navigate = useNavigate();

    // Use a placeholder function for the button's action if onComplete isn't defined
    const handleButtonClick = () => {
        onComplete?.(); // Call the finalization logic provided by the parent page
        navigate('/dashboard', { replace: true }); // Immediately navigate to the dashboard
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center p-4">
            <Card 
                title="Your CareerLoop Launchpad" 
                className="w-full max-w-4xl shadow-2xl text-center"
            >
                {/* Title Section */}
                <h2 className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400 mb-6">
                    Congratulations, {user?.name || 'Explorer'}!
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-10">
                    Your **AI-powered career path** is ready. Here's a glimpse of your personalized dashboard.
                </p>

                {/* Preview Cards Grid (Static/Mock Data) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    
                    <Card 
                        title="Top Recommended Domain" 
                        titleIcon={TrendingUp} 
                        className="bg-green-50 dark:bg-green-900/20"
                    >
                        <p className="text-xl font-bold text-green-700 dark:text-green-300">Web Development</p>
                        <p className="text-sm text-gray-500 mt-1">Score: 85% Match</p>
                    </Card>

                    <Card title="Immediate Next Task" titleIcon={Users}>
                        <p className="text-gray-800 dark:text-gray-200 font-medium">
                            Build a minimum viable portfolio project.
                        </p>
                        <p className="text-sm text-gray-500 mt-1">Priority: High</p>
                    </Card>

                    <Card title="Skill Gap" titleIcon={TrendingUp}>
                        <p className="text-gray-800 dark:text-gray-200 font-medium">
                            Node.js API security
                        </p>
                        <p className="text-sm text-gray-500 mt-1">Recommended course: 1</p>
                    </Card>
                </div>

                {/* Final Navigation Button */}
                <Button
                    onClick={handleButtonClick}
                    size="lg"
                    className="w-full md:w-auto"
                    variant="primary"
                >
                    Go to Full Dashboard
                </Button>
            </Card>
        </div>
    );
};
