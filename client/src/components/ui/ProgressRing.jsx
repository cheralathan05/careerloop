import React from 'react';

/**
 * @desc SVG component to display progress as a circular ring (used in OnboardingLayout).
 * @param {number} progress - The current progress value (0-100).
 * @param {number} size - The width and height of the SVG viewport.
 * @param {number} strokeWidth - The thickness of the ring stroke.
 */
export const ProgressRing = ({ progress = 0, size = 100, strokeWidth = 8 }) => {
    // --- SVG Math ---
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    // Calculate how much of the stroke should be hidden (offset)
    const offset = circumference - (Math.min(progress, 100) / 100) * circumference;
    const center = size / 2;

    // --- Render ---
    return (
        <svg
            height={size}
            width={size}
            // Apply -rotate-90 transform to the entire SVG for the progress arc start point
            className="transform -rotate-90"
            viewBox={`0 0 ${size} ${size}`}
        >
            {/* Background Circle (Inactive track) */}
            <circle
                stroke="#e5e7eb" // gray-200
                fill="transparent"
                strokeWidth={strokeWidth}
                r={radius}
                cx={center}
                cy={center}
                className="dark:stroke-gray-700"
            />

            {/* Progress Arc (Active track) */}
            <circle
                stroke="#4f46e5" // indigo-600
                fill="transparent"
                strokeLinecap="round" // Gives the progress arc rounded ends
                strokeWidth={strokeWidth}
                r={radius}
                cx={center}
                cy={center}
                strokeDasharray={circumference + ' ' + circumference}
                style={{
                    strokeDashoffset: offset,
                    transition: 'stroke-dashoffset 0.8s ease-in-out',
                }}
                className="dark:stroke-indigo-400"
            />
            
            {/* Text Label (Must be rotated back +90 degrees) */}
            <text
                x={center}
                y={center}
                dominantBaseline="middle"
                textAnchor="middle"
                // Rotate the text back by 90 degrees to appear upright relative to the container
                transform={`rotate(90 ${center} ${center})`}
                className="text-sm font-bold fill-gray-800 dark:fill-white"
            >
                {/* Use a tspan/text element to display the calculated progress */}
                <tspan 
                    className="text-base font-bold text-gray-800 dark:text-white" // Re-apply specific text styles
                >
                    {Math.round(progress)}%
                </tspan>
            </text>
        </svg>
    );
};
