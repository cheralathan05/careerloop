// src/components/onboarding/SummaryChart.jsx

import React from 'react';
import SkillRadarChart from '../charts/SkillRadarChart';

const SummaryChart = ({ skillData }) => {
    return (
        <div className="onboarding-summary-chart-container">
            <h4 className="chart-title">Skill Assessment Results</h4>
            <SkillRadarChart data={skillData} />
            <p className="summary-insight">Areas of growth highlighted in red.</p>
        </div>
    );
};

export default SummaryChart;