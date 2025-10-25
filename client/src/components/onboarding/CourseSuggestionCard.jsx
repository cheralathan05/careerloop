import React from 'react';
import { Card } from '../common/Card'; // Fixed in previous step
import { BookOpen, Globe, Star } from 'lucide-react';

/**
 * @typedef {object} Course
 * @property {string} title - Title of the course.
 * @property {string} provider - Platform/organization offering the course.
 * @property {string} url - Link to the course.
 * @property {number} [rating] - Optional user rating (e.g., 4.5).
 */

/**
 * @desc Component to display a single course suggestion from the AI.
 */
const CourseItem = ({ course }) => (
    <a 
        href={course.url || '#'} 
        target="_blank" 
        rel="noopener noreferrer"
        className="block p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:shadow-md transition duration-150 transform hover:scale-[1.01]"
    >
        <h4 className="text-md font-semibold text-indigo-600 dark:text-indigo-400 hover:underline mb-2 flex items-start">
            <BookOpen className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
            {course.title}
        </h4>
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
            {/* Provider */}
            <span className="flex items-center">
                <Globe className="w-3 h-3 mr-1 flex-shrink-0" />
                {course.provider || 'External Source'}
            </span>
            {/* Rating */}
            {course.rating && (
                <span className="flex items-center">
                    <Star className="w-3 h-3 mr-1 text-yellow-500 fill-yellow-500" />
                    {course.rating.toFixed(1)}
                </span>
            )}
        </div>
    </a>
);


/**
 * @desc Component to display a list of AI-recommended courses.
 * @param {Array<Course>} courses - List of course objects.
 */
export const CourseSuggestionCard = ({ courses = [] }) => {
    return (
        <Card title="Recommended Learning Paths" titleIcon={BookOpen}>
            {courses.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400">
                    No specific courses found, but focus on building projects or consult the AI Assistant.
                </p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {courses.map((course, index) => (
                        <CourseItem key={index} course={course} />
                    ))}
                </div>
            )}
        </Card>
    );
};

