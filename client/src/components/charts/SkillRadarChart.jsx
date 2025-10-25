import React from "react";
import {
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    ResponsiveContainer,
    Tooltip,
} from "recharts";

/**
 * @typedef {object} RadarDataPoint
 * @property {string} subject - The skill/domain name.
 * @property {number} score - User score (0-100).
 * @property {number} fullMark - Maximum possible score (usually 100).
 */

/**
 * @desc Displays user's skill assessment on a Radar Chart.
 * @param {Array<RadarDataPoint>} data - Array of structured skill scores (e.g., from chartUtils.js).
 * @param {string} title - Chart title.
 */
export const SkillRadarChart = ({
    // Expect data to already be in the final Recharts format (subject, score, fullMark)
    data = [], 
    title = "Skill Proficiency Overview",
}) => {
    // If we receive data that is not in the expected Recharts format 
    // (e.g., using 'label' instead of 'subject' as in the old typedef), remap it safely.
    const chartData = data.map(item => ({
        subject: item.subject || item.label, // Use 'subject' if available, fallback to 'label'
        score: item.score || item.value,     // Use 'score' if available, fallback to 'value'
        fullMark: item.fullMark || 100,      // Default to 100
    }));

    if (!chartData.length) {
        return (
            <div className="p-4 h-96 flex items-center justify-center text-center text-gray-500 dark:text-gray-400">
                No skill data available to generate radar chart. Please complete the assessment.
            </div>
        );
    }

    return (
        <div className="w-full h-96 p-4 bg-white dark:bg-gray-800 rounded-xl">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
                {title}
            </h3>

            <ResponsiveContainer width="100%" height="90%">
                <RadarChart
                    cx="50%"
                    cy="50%"
                    outerRadius="80%"
                    data={chartData}
                    margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                >
                    {/* Grid (Theme-aware stroke) */}
                    <PolarGrid stroke="#e5e7eb" className="dark:stroke-gray-700" />

                    {/* Skill Labels (Domain names) */}
                    <PolarAngleAxis
                        dataKey="subject"
                        stroke="#4b5563"
                        tick={{ fill: "currentColor", fontSize: 12 }}
                    />

                    {/* Radial Axis (Max Value) */}
                    <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} />

                    {/* Data Polygon (Your Score) */}
                    <Radar
                        name="Your Score"
                        dataKey="score"
                        stroke="#4f46e5"
                        fill="#4f46e5"
                        fillOpacity={0.6}
                        dot={true} // Add dots to the vertices
                        animationDuration={1500} // Add animation
                    />

                    {/* Tooltip (Theme-aware styling) */}
                    <Tooltip
                        contentStyle={{
                            backgroundColor: "#2d3748",
                            border: "none",
                            borderRadius: "8px",
                            color: "#fff",
                        }}
                        cursor={{ stroke: "#4f46e5", strokeWidth: 1 }}
                    />
                </RadarChart>
            </ResponsiveContainer>
        </div>
    );
};
