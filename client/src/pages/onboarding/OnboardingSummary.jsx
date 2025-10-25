import React, { useMemo } from 'react'; // Added useMemo
import { useOnboarding } from '../../hooks/useOnboarding'; // Fixed in step 19
import { OnboardingLayout } from '../../components/layout/OnboardingLayout';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { SkillRadarChart } from '../../components/charts/SkillRadarChart';
import { SkillProgressGraph } from '../../components/charts/SkillProgressGraph';
import { AILoader } from '../../components/loaders/AILoader';
import { ArrowRight, Zap, BookOpen, CheckCircle, AlertTriangle } from 'lucide-react'; // Added AlertTriangle
import { AlertBox } from '../../components/ui/AlertBox';

/**
 * @desc Phase 5: Displays the final AI-generated summary report.
 */
const OnboardingSummaryPage = () => {
    const { 
        // NOTE: skillScores is now part of the summary object in the fixed hook logic
        onboardingState: { summary }, 
        nextPhase, 
        isLoading, 
        onboardingError 
    } = useOnboarding();

    // Safely destructure data from the summary, defaulting to empty structures
    const { 
        radar: radarData = [], 
        recommendedTasks: tasks = [], 
        suggestedCourses: courses = [],
        skillScores = {} // Assuming skillScores are nested here or passed separately via context
    } = summary || {};
    
    // Calculate overall score (Memoized for performance)
    const { totalScoreItems, averageScorePercentage } = useMemo(() => {
        const scores = Object.values(skillScores);
        const totalItems = scores.length;
        if (totalItems === 0) {
            return { totalScoreItems: 0, averageScorePercentage: 0 };
        }
        
        // Sum the scores (assuming 0-10 scale)
        const rawSum = scores.reduce((sum, score) => sum + score, 0);
        const rawAverage = rawSum / totalItems;

        // Scale the average to a percentage (0-100)
        // Max possible raw score is assumed to be 10 (or similar max defined in the backend/chartUtils)
        const maxRawScore = 10; 
        const percentage = Math.round((rawAverage / maxRawScore) * 100);

        return { totalScoreItems: totalItems, averageScorePercentage: percentage };
    }, [skillScores]);

    // --- Loading and Error States ---

    if (isLoading) return (
        <OnboardingLayout title="Analyzing Results">
            <AILoader text="Compiling final report and personalized recommendations..." />
        </OnboardingLayout>
    );

    if (onboardingError) return (
        <OnboardingLayout title="Error">
            <AlertBox type="error" message={onboardingError} />
        </OnboardingLayout>
    );

    // CRITICAL CHECK: If API succeeded but data is missing/empty
    if (!summary || radarData.length === 0) return (
        <OnboardingLayout title="Summary Missing">
            <AlertBox 
                type="error" 
                message="Final summary data is unavailable. The assessment results may not have been scored correctly by the AI." 
                icon={AlertTriangle}
            />
        </OnboardingLayout>
    );

    // --- Main Render ---

    return (
        <OnboardingLayout title="Your Personalized Summary" className="max-w-4xl">
            <h2 className="text-2xl font-bold text-indigo-700 dark:text-indigo-400 mb-4 flex items-center">
                <Zap className="w-6 h-6 mr-2" /> Key Insights
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                {/* Radar Chart (Col 1 & 2) */}
                <Card className="lg:col-span-2">
                    {/* Pass the radar data to the fixed chart component */}
                    <SkillRadarChart data={radarData} title="Proficiency Across Domains" />
                </Card>

                {/* Overall Score/Tasks (Col 3) */}
                <div className="space-y-6">
                    <SkillProgressGraph 
                        percentage={averageScorePercentage} 
                        label="Overall Assessment Score"
                        detail={`Based on your performance in ${totalScoreItems} skill categories.`}
                    />

                    <Card title="Immediate Next Steps" titleIcon={CheckCircle} className="h-full">
                        {tasks.length > 0 ? (
                            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                                {tasks.map((task, index) => (
                                    <li key={index} className="ml-2">{task}</li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500 dark:text-gray-400">No immediate tasks generated. Proceed to the AI Chat for personalized guidance.</p>
                        )}
                    </Card>
                </div>
            </div>
            
            {/* Recommended Courses (Full Width) */}
            <Card title="Recommended Courses" titleIcon={BookOpen}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {courses.length > 0 ? (
                        courses.map((course, index) => (
                            <div key={index} className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg border dark:border-gray-600">
                                <a href="#" target="_blank" className="text-indigo-600 hover:underline dark:text-indigo-400 font-medium">
                                    {course}
                                </a>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 dark:text-gray-400 sm:col-span-2">No specific courses suggested yet. Check with the AI Assistant for more options.</p>
                    )}
                </div>
            </Card>

            <Button onClick={nextPhase} icon={ArrowRight} className="w-full mt-6">
                Continue to AI Assistant Chat
            </Button>
        </OnboardingLayout>
    );
};

export default OnboardingSummaryPage;
