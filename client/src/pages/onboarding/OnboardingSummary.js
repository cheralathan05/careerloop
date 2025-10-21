// src/pages/onboarding/OnboardingSummary.js

import React, { useEffect, useState } from 'react';
import useOnboarding from '../../hooks/useOnboarding';
import OnboardingLayout from '../../components/layout/OnboardingLayout';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import SkillRadarChart from '../../components/charts/SkillRadarChart';
import MentorSuggestionList from '../../components/onboarding/MentorSuggestionList';
import CourseSuggestionCard from '../../components/onboarding/CourseSuggestionCard';
import onboardingService from '../../services/onboardingService';

const OnboardingSummary = () => {
    const { state, nextPhase, updateOnboardingState } = useOnboarding();
    const [isLoading, setIsLoading] = useState(false);

    // Assume skillAssessmentScores are calculated in Phase 8
    const skillData = state.skillAssessmentScores || {
        labels: ['Core Concepts', 'Problem Solving', 'Tool Proficiency', 'Domain Specific'],
        scores: [65, 75, 40, 55], // Mock Scores if coming directly from Phase 7
        gaps: ['Tool Proficiency', 'Domain Specific']
    };

    // AI Interaction: Fetch recommendations after assessment is done (Phase 8 completed)
    useEffect(() => {
        const fetchRecommendations = async () => {
            if (state.aiRecommendations) return; // Skip if already fetched

            setIsLoading(true);
            try {
                // Mock API call to get personalized suggestions
                const recommendations = await onboardingService.getAIRecommendations(skillData);
                updateOnboardingState({ aiRecommendations: recommendations });
            } catch (error) {
                console.error("Error fetching AI recommendations:", error);
                // Fallback structure
                updateOnboardingState({ 
                    aiRecommendations: { 
                        tasks: ["Complete first module in Python Basics.", "Practice 2 easy coding challenges."],
                        mentors: [{ id: 1, name: "Alice J." }, { id: 2, name: "Bob K." }],
                        courses: [{ name: "Advanced React Hooks", provider: "Udemy" }]
                    } 
                });
            } finally {
                setIsLoading(false);
            }
        };

        fetchRecommendations();
    }, [state.aiRecommendations, updateOnboardingState, skillData]);

    const handleNext = () => {
        // System Action: Prepare session for AI chat and move to next phase (10)
        nextPhase();
    };

    const completionPercentage = Math.round((9 / 10) * 100); // Phase 9 / Total 10

    if (isLoading) {
        return <OnboardingLayout><OnboardingLoader message="Generating personalized learning blueprint..." /></OnboardingLayout>;
    }

    return (
        <OnboardingLayout>
            <div className="onboarding-summary-page">
                <h2>Phase 9: Your Career Blueprint is Ready!</h2>
                <div className="summary-layout">
                    
                    {/* 1. Skill Radar Chart */}
                    <Card className="chart-panel">
                        <h3>Skill Radar</h3>
                        <SkillRadarChart data={skillData} />
                        <p className="completion-info">Onboarding Progress: **{completionPercentage}%** Complete</p>
                    </Card>

                    {/* 2. Strengths and Gaps */}
                    <Card className="summary-info">
                        <h3>Insights</h3>
                        <p><strong>Strengths:</strong> {skillData.labels.filter((_, i) => skillData.scores[i] >= 70).join(', ') || 'N/A'}</p>
                        <p className="gap-alert">
                            <strong>Gaps to Close:</strong> {skillData.gaps.join(', ') || 'None identified!'}
                        </p>
                    </Card>

                    {/* 3. AI Recommendations */}
                    <div className="recommendations-grid">
                        <CourseSuggestionCard courses={state.aiRecommendations?.courses} />
                        <MentorSuggestionList mentors={state.aiRecommendations?.mentors} />
                    </div>

                </div>

                <Button onClick={handleNext} variant="primary" size="large">
                    Next: Speak with AI Onboarding Assistant (10)
                </Button>
            </div>
        </OnboardingLayout>
    );
};

export default OnboardingSummary;