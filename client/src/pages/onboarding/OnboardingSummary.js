import React from 'react';
import { useOnboarding } from '../../../hooks/useOnboarding';
import { OnboardingLayout } from '../../../components/layout/OnboardingLayout';
import { Button } from '../../../components/common/Button';
import { Card } from '../../../components/common/Card';
import { SkillRadarChart } from '../../../components/charts/SkillRadarChart';
import { SkillProgressGraph } from '../../../components/charts/SkillProgressGraph';
import { AILoader } from '../../../components/loaders/AILoader';
import { ArrowRight, Zap, BookOpen, CheckCircle } from 'lucide-react';
import { AlertBox } from '../../../components/ui/AlertBox';

/**
 * @desc Phase 5: Displays the final AI-generated summary report.
 */
const OnboardingSummaryPage = () => {
    const { 
        onboardingState: { summary, skillScores }, 
        nextPhase, 
        isLoading, 
        onboardingError 
    } = useOnboarding();

    // Safely calculate average score for the progress graph
    const totalScoreItems = Object.keys(skillScores).length;
    const averageScore = totalScoreItems 
        ? Object.values(skillScores).reduce((sum, score) => sum + score, 0) / totalScoreItems 
        : 0;

    if (isLoading || !summary) return <OnboardingLayout title="Analyzing Results"><AILoader text="Compiling final report and personalized recommendations..." /></OnboardingLayout>;
    
    if (onboardingError) return <OnboardingLayout title="Error"><AlertBox type="error" message={onboardingError} /></OnboardingLayout>;

    const { radar: radarData, recommendedTasks: tasks, suggestedCourses: courses } = summary;

    return (
        <OnboardingLayout title="Your Personalized Summary" className="max-w-4xl">
            <h2 className="text-2xl font-bold text-indigo-700 dark:text-indigo-400 mb-4 flex items-center">
                <Zap className="w-6 h-6 mr-2" /> Key Insights
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                
                {/* Radar Chart (Col 1 & 2) */}
                <Card className="lg:col-span-2">
                    <SkillRadarChart data={radarData} title="Proficiency Across Domains" />
                </Card>

                {/* Overall Score/Tasks (Col 3) */}
                <div className="space-y-6">
                    <SkillProgressGraph 
                        percentage={averageScore * 10} // Assuming scores are 0-10, scale to 0-100
                        label="Overall Assessment Score"
                        detail={`Based on your performance in ${totalScoreItems} skill categories.`}
                    />

                    <Card title="Immediate Next Steps" titleIcon={CheckCircle} className="h-full">
                        <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                            {tasks.map((task, index) => (
                                <li key={index} className="ml-2">{task}</li>
                            ))}
                        </ul>
                    </Card>
                </div>
            </div>
            
            {/* Recommended Courses (Full Width) */}
            <Card title="Recommended Courses" titleIcon={BookOpen}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {courses.map((course, index) => (
                        <div key={index} className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg border dark:border-gray-600">
                            <a href="#" target="_blank" className="text-indigo-600 hover:underline dark:text-indigo-400 font-medium">
                                {course}
                            </a>
                        </div>
                    ))}
                </div>
            </Card>

            <Button onClick={nextPhase} icon={ArrowRight} className="w-full mt-6">
                Continue to AI Assistant Chat
            </Button>
        </OnboardingLayout>
    );
};

export default OnboardingSummaryPage;