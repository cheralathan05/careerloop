import React from 'react';
import { Card } from '../common/Card';
import { BookOpen, Globe, Star } from 'lucide-react';

/**
 * @typedef {object} Course
 * @property {string} title
 * @property {string} provider
 * @property {string} url
 * @property {number} [rating]
 */

/**
 * @desc Component to display a single course suggestion from the AI.
 */
const CourseItem = ({ course }) => (
    <a 
        href={course.url || '#'} 
        target="_blank" 
        rel="noopener noreferrer"
        className="block p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:shadow-md transition duration-150"
    >
        <h4 className="text-md font-semibold text-indigo-600 dark:text-indigo-400 hover:underline mb-1 flex items-center">
            <BookOpen className="w-4 h-4 mr-2" />
            {course.title}
        </h4>
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
            <span className="flex items-center">
                <Globe className="w-3 h-3 mr-1" />
                {course.provider}
            </span>
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
                <p className="text-gray-500 dark:text-gray-400">No specific courses found, but focus on building projects.</p>
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