import React from 'react';

/**
 * @desc SVG component to display progress as a circular ring (used in OnboardingLayout).
 */
export const ProgressRing = ({ progress = 0, size = 100, strokeWidth = 8 }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (progress / 100) * circumference;

    return (
        <svg
            height={size}
            width={size}
            className="transform -rotate-90"
            viewBox={`0 0 ${size} ${size}`}
        >
            {/* Background Circle */}
            <circle
                stroke="#e5e7eb" // gray-200
                fill="transparent"
                strokeWidth={strokeWidth}
                r={radius}
                cx={size / 2}
                cy={size / 2}
                className="dark:stroke-gray-700"
            />

            {/* Progress Arc */}
            <circle
                stroke="#4f46e5" // indigo-600
                fill="transparent"
                strokeWidth={strokeWidth}
                r={radius}
                cx={size / 2}
                cy={size / 2}
                strokeDasharray={circumference + ' ' + circumference}
                style={{
                    strokeDashoffset: offset,
                    transition: 'stroke-dashoffset 0.8s ease-in-out',
                }}
                className="dark:stroke-indigo-400"
            />
            
            {/* Text Label */}
            <text
                x="50%"
                y="50%"
                dominantBaseline="middle"
                textAnchor="middle"
                className="text-sm font-bold fill-indigo-600 dark:fill-indigo-400 transform rotate-90 translate-x-1/2"
                style={{ transform: `rotate(90deg) translate(0px, 0px)` }}
            >
                <tspan 
                    x={size / 2} 
                    y={size / 2} 
                    className="text-base font-bold text-gray-800 dark:text-white"
                    style={{ transform: `rotate(90deg)` }}
                >
                    {Math.round(progress)}%
                </tspan>
            </text>
        </svg>
    );
};