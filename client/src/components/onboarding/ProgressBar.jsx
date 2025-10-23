import React from 'react';

/**
 * @desc Simple linear progress bar component.
 * @param {number} current - Current value (e.g., questions answered).
 * @param {number} total - Total value (e.g., total questions).
 * @param {string} label - Text description of what is progressing.
 */
export const ProgressBar = ({ current, total, label }) => {
    const progress = total > 0 ? Math.min(100, Math.round((current / total) * 100)) : 0;

    return (
        <div className="mb-4">
            <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
                <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">{current} / {total} ({progress}%)</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div 
                    className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500 ease-out" 
                    style={{ width: `${progress}%` }}
                    role="progressbar"
                    aria-valuenow={current}
                    aria-valuemin="0"
                    aria-valuemax={total}
                ></div>
            </div>
        </div>
    );
};