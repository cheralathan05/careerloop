// src/components/charts/SkillRadarChart.jsx

import React from 'react';
// In a real app, this would import a charting library like Chart.js or Recharts

const SkillRadarChart = ({ data }) => {
    const { labels = [], scores = [] } = data || {};
    
    if (labels.length === 0) {
        return <div className="chart-placeholder">Run assessment to see skill radar.</div>;
    }

    // Mock rendering the data visually
    const chartContent = labels.map((label, index) => (
        <div key={label} className="radar-segment">
            <span className="radar-label">{label}:</span>
            <div className="radar-score-bar" style={{ width: `${scores[index]}%` }}>
                {scores[index]}
            </div>
        </div>
    ));

    return (
        <div className="skill-radar-chart">
            {/*  */}
            {chartContent}
            <p className="chart-disclaimer">Visualization powered by AI assessment data.</p>
        </div>
    );
};

export default SkillRadarChart;