import React, { useEffect, useState } from 'react';
import { Award, TrendingUp } from 'lucide-react';

/**
 * @desc Animated horizontal progress bar for skill or assessment score.
 * @param {number} percentage - The score as a percentage (0-100).
 * @param {string} label - Title of the progress bar (e.g., 'Overall Assessment Score').
 * @param {string} detail - Additional detail text (e.g., 'Based on 50 questions').
 */
export const SkillProgressGraph = ({ percentage = 0, label, detail }) => {
  const [animatedWidth, setAnimatedWidth] = useState(0);

  // Trigger animation on mount or percentage change
  useEffect(() => {
    const finalWidth = Math.min(100, Math.max(0, percentage));
    const timer = setTimeout(() => setAnimatedWidth(finalWidth), 100);
    return () => clearTimeout(timer);
  }, [percentage]);

  // Determine bar color based on score
  const barColor =
    percentage >= 80 ? 'bg-green-500' :
    percentage >= 50 ? 'bg-yellow-500' :
    'bg-red-500';

  return (
    <div className="p-4 rounded-xl border dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg">
      
      {/* Header: Label & Percentage */}
      <div className="flex justify-between items-center mb-2">
        <h4 className="text-md font-semibold text-gray-700 dark:text-gray-300 flex items-center">
          <Award className="w-5 h-5 mr-2 text-indigo-600 dark:text-indigo-400" />
          {label}
        </h4>
        <span className={`text-xl font-bold ${percentage >= 70 ? 'text-indigo-600' : 'text-gray-500'} dark:text-white`}>
          {Math.round(animatedWidth)}%
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 overflow-hidden">
        <div
          className={`${barColor} h-2.5 rounded-full transition-all duration-1000 ease-out`}
          style={{ width: `${animatedWidth}%` }}
          role="progressbar"
          aria-valuenow={percentage}
          aria-valuemin={0}
          aria-valuemax={100}
        ></div>
      </div>

      {/* Detail Text */}
      {detail && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 flex items-center">
          <TrendingUp className="w-3 h-3 mr-1" />
          {detail}
        </p>
      )}
    </div>
  );
};
