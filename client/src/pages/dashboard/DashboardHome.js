// src/pages/dashboard/DashboardHome.js

import React, { useEffect, useState } from 'react';
import useOnboarding from '../../hooks/useOnboarding';
import SkillRadarChart from '../../components/charts/SkillRadarChart';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import useAnalytics from '../../hooks/useAnalytics'; // For tracking entry

const DashboardHome = () => {
    const { state } = useOnboarding();
    const { trackEvent } = useAnalytics();
    const [initialLoad, setInitialLoad] = useState(true);

    // Placeholder data based on successful onboarding
    const { fullName, selectedDomains, aiRecommendations } = state.userData;
    const skillData = state.skillAssessmentScores || { labels: ['Adaptability', 'Technical', 'Leadership'], scores: [80, 75, 50] };
    
    // System Action: Track user entry into the main application
    useEffect(() => {
        if (initialLoad) {
            trackEvent('DASHBOARD_ENTER', { userId: fullName, domains: selectedDomains.join(',') });
            setInitialLoad(false);
        }
    }, [initialLoad, trackEvent, fullName, selectedDomains]);


    return (
        <div className="dashboard-layout">
            <header className="dashboard-header">
                <h1>Welcome back, {fullName || 'Future Pro'}! 🚀</h1>
                <p>Your personalized career journey starts here.</p>
            </header>

            <div className="dashboard-grid">
                
                {/* Progress Overview Card (Phase 12) */}
                <Card title="Current Skill Radar">
                    <SkillRadarChart data={skillData} />
                    <p className="summary-text">
                        **Skill Gap:** Your biggest gap is in **{skillData.labels[skillData.scores.indexOf(Math.min(...skillData.scores))]}**.
                    </p>
                    <Button variant="secondary">View Progress Overview</Button>
                </Card>

                {/* AI Dashboard Insights (Phase 16) */}
                <Card title="AI Insights & Tasks">
                    <p className="insight-text">
                        The AI recommends focusing on **{aiRecommendations?.focusArea || selectedDomains[0]}** this week.
                    </p>
                    <p>
                        **Next Task:** {aiRecommendations?.tasks[0] || "Review your Daily Planner (Phase 17)."}
                    </p>
                    <Button variant="primary">Go to Planner</Button>
                </Card>
                
                {/* Other Cards would link to Phase 13 (Leaderboard), 14 (Achievements), etc. */}
                
            </div>
        </div>
    );
};

export default DashboardHome;