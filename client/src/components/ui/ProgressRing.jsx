// src/components/ui/ProgressRing.jsx

import React from 'react';

const ProgressRing = ({ radius, stroke, progress }) => {
    const normalizedRadius = radius - stroke * 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
        <svg height={radius * 2} width={radius * 2} className="progress-ring">
            <circle
                stroke="var(--color-surface)"
                fill="transparent"
                strokeWidth={stroke}
                r={normalizedRadius}
                cx={radius}
                cy={radius}
            />
            <circle
                stroke="var(--color-primary)"
                fill="transparent"
                strokeDasharray={circumference + ' ' + circumference}
                style={{ strokeDashoffset }}
                strokeWidth={stroke}
                r={normalizedRadius}
                cx={radius}
                cy={radius}
            />
            <text x="50%" y="50%" textAnchor="middle" dy=".3em" className="ring-text">
                {progress}%
            </text>
        </svg>
    );
};

export default ProgressRing;