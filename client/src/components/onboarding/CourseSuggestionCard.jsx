// src/components/onboarding/CourseSuggestionCard.jsx

import React from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';

const CourseSuggestionCard = ({ courses = [] }) => {
    return (
        <Card title="AI Recommended Courses" className="suggestion-card course-card">
            {courses.length > 0 ? (
                <ul>
                    {courses.slice(0, 3).map(course => (
                        <li key={course.id || course.name}>
                            <strong>{course.name}</strong> from {course.provider}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No immediate course recommendations. Focus on your tasks first!</p>
            )}
            <Button variant="default" size="small">Explore Topics (22)</Button>
        </Card>
    );
};

export default CourseSuggestionCard;