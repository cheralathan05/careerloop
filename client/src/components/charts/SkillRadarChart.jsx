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
 * @property {string} label - The skill/domain name.
 * @property {number} value - User score (0-100).
 * @property {number} fullMark - Maximum possible score (usually 100).
 */

/**
 * @desc Displays user's skill assessment on a Radar Chart.
 * @param {Array<RadarDataPoint>} data - Array of structured skill scores.
 * @param {string} title - Chart title.
 */
export const SkillRadarChart = ({
  data = [],
  title = "Skill Proficiency Overview",
}) => {
  if (!data.length) {
    return (
      <div className="p-4 text-center text-gray-500 dark:text-gray-400">
        No skill data available to generate radar chart.
      </div>
    );
  }

  const chartData = data.map((item) => ({
    subject: item.label,
    score: item.value,
    fullMark: 100,
  }));

  return (
    <div className="w-full h-96 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
        {title}
      </h3>

      <ResponsiveContainer width="100%" height="100%">
        <RadarChart
          cx="50%"
          cy="50%"
          outerRadius="80%"
          data={chartData}
          margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
        >
          {/* Grid */}
          <PolarGrid stroke="#e5e7eb" className="dark:stroke-gray-700" />

          {/* Skill Labels */}
          <PolarAngleAxis
            dataKey="subject"
            stroke="#4b5563"
            tick={{ fill: "currentColor", fontSize: 12 }}
          />

          {/* Radial Axis */}
          <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} />

          {/* Data Polygon */}
          <Radar
            name="Your Score"
            dataKey="score"
            stroke="#4f46e5"
            fill="#4f46e5"
            fillOpacity={0.6}
          />

          {/* Tooltip */}
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
