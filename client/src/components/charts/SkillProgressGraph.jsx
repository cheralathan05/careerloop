// src/components/charts/SkillProgressGraph.jsx

import React from 'react';
// Note: In a production app, a library like Recharts or Chart.js would be used.

const SkillProgressGraph = ({ data }) => {
    const { months = [], scores = [] } = data || {};
    
    if (months.length === 0) {
        return <div className="chart-placeholder">History data unavailable. Complete more tasks to track progress.</div>;
    }

    const maxScore = 100;
    const minScore = 0;
    
    // Calculate points for a simple SVG polyline (mock line graph)
    const height = 150;
    const width = 400;
    const padding = 30;
    const chartWidth = width - 2 * padding;
    const chartHeight = height - 2 * padding;
    
    const pointString = scores.map((score, index) => {
        const x = padding + (index / (scores.length - 1)) * chartWidth;
        const y = padding + chartHeight - ((score - minScore) / (maxScore - minScore)) * chartHeight;
        return `${x},${y}`;
    }).join(' ');

    return (
        <div className="skill-progress-graph-container">
            <h4 className="chart-title">Overall Skill Trend</h4>
            <svg viewBox={`0 0 ${width} ${height}`} className="skill-progress-svg">
                {/* X and Y axes (simplified) */}
                <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="var(--color-text)" strokeWidth="1" />
                
                {/* The Skill Line */}
                <polyline
                    fill="none"
                    stroke="var(--color-primary)"
                    strokeWidth="3"
                    points={pointString}
                />
                
                {/* Data points */}
                {scores.map((score, index) => {
                    const x = padding + (index / (scores.length - 1)) * chartWidth;
                    const y = padding + chartHeight - ((score - minScore) / (maxScore - minScore)) * chartHeight;
                    return (
                        <circle key={index} cx={x} cy={y} r="3" fill="var(--color-primary)" title={`${months[index]}: ${score}%`} />
                    );
                })}

                {/* X-Axis Labels */}
                {months.map((month, index) => {
                    const x = padding + (index / (scores.length - 1)) * chartWidth;
                    return (
                        <text key={index} x={x} y={height - padding + 15} textAnchor="middle" fontSize="10" fill="var(--color-text)">
                            {month}
                        </text>
                    );
                })}
            </svg>
            <p className="graph-caption">Your score is currently **{scores[scores.length - 1]}%**.</p>
        </div>
    );
};

export default SkillProgressGraph;