import React from 'react';
import { Card } from '../common/Card';
import { SkillRadarChart } from '../charts/SkillRadarChart';
import { SkillProgressGraph } from '../charts/SkillProgressGraph';
import { TrendingUp } from 'lucide-react';

/**
 * @desc Component that groups the main visualization elements for the final summary page.
 * @param {Array<object>} radarData - Data structured for the radar chart.
 * @param {number} overallScore - The overall percentage score (0-100).
 * @param {string} scoreDetail - Detail text for the progress graph.
 */
export const SummaryChart = ({ radarData, overallScore, scoreDetail }) => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            
            {/* Radar Chart (Col 1 & 2) */}
            <Card title="Skill Proficiency Radar" className="lg:col-span-2">
                {/* Passes data structured from the fixed useOnboarding hook */}
                <SkillRadarChart data={radarData} title="Proficiency Across Domains" />
            </Card>

            {/* Overall Score/Progress (Col 3) */}
            <div className="space-y-6">
                {/* Skill Progress Graph */}
                <SkillProgressGraph 
                    percentage={overallScore} // Expects a value from 0 to 100
                    label="Overall Assessment Score"
                    detail={scoreDetail}
                />

                {/* Additional Insight Card */}
                <Card title="Career Trajectory" titleIcon={TrendingUp} className="h-full">
                    <p className="text-gray-700 dark:text-gray-300 text-sm">
                        Your profile shows strong foundational skills. Focus on intermediate application and real-world projects to maximize growth over the next 6 months.
                    </p>
                </Card>
            </div>
        </div>
    );
};

