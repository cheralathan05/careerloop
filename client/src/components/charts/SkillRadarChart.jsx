import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';

/**
 * @typedef {object} RadarDataPoint
 * @property {string} label - The name of the skill/domain.
 * @property {number} value - The score (0-100).
 * @property {number} fullMark - The maximum possible score (usually 100).
 */

/**
 * @desc Displays the user's skill assessment results on a Radar Chart.
 * Assumes data is pre-transformed by the server/utils/radarChartUtils.js.
 * @param {Array<RadarDataPoint>} data - Array of structured skill scores.
 * @param {string} title - Title for the chart.
 */
export const SkillRadarChart = ({ data = [], title = "Skill Proficiency Overview" }) => {
    
    if (data.length === 0) {
        return (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                No skill data available to generate radar chart.
            </div>
        );
    }

    // Prepare data for Recharts: RadarChart expects one object per skill,
    // where the key is the skill name, and the value is the score.
    // We restructure it slightly to fit the required format for multiple series if needed, 
    // but here we use a single series based on the 'label' and 'value' properties.
    const chartData = data.map(item => ({
        subject: item.label,
        A: item.value, // Series A: User's Score
        fullMark: 100, // Maximum score for the axis
    }));

    return (
        <div className="w-full h-96 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">{title}</h3>
            <ResponsiveContainer width="100%" height="100%">
                <RadarChart 
                    cx="50%" 
                    cy="50%" 
                    outerRadius="80%" 
                    data={chartData}
                    // A margin is often necessary to prevent labels from being cut off
                    margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                >
                    <PolarGrid stroke="#e5e7eb" className="dark:stroke-gray-700" />
                    
                    {/* PolarAngleAxis: Renders the labels (skill names) */}
                    <PolarAngleAxis 
                        dataKey="subject" 
                        stroke="#4b5563" 
                        tick={{ fill: 'currentColor', fontSize: 12, className: 'dark:fill-gray-300' }}
                    />
                    
                    {/* PolarRadiusAxis: Renders the score axis (0 to 100) */}
                    <PolarRadiusAxis 
                        angle={90} 
                        domain={[0, 100]} 
                        stroke="#9ca3af" 
                        tick={false} // Hide ticks on the radial axis
                    />

                    {/* Radar: The actual data polygon */}
                    <Radar 
                        name="Your Score" 
                        dataKey="A" 
                        stroke="#4f46e5" 
                        fill="#4f46e5" 
                        fillOpacity={0.6} 
                    />
                    
                    {/* Tooltip for hovering over the chart */}
                    <Tooltip 
                        contentStyle={{ 
                            backgroundColor: '#2d3748', 
                            border: 'none', 
                            borderRadius: '8px' 
                        }}
                    />
                </RadarChart>
            </ResponsiveContainer>
        </div>
    );
};
