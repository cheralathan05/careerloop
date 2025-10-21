// src/components/onboarding/MentorSuggestionList.jsx

import React from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';

const MentorSuggestionList = ({ mentors = [] }) => {
    return (
        <Card title="AI Mentor Matchmaker" className="suggestion-card mentor-card">
            {mentors.length > 0 ? (
                <ul className="mentor-list">
                    {mentors.slice(0, 2).map(mentor => (
                        <li key={mentor.id}>
                            👤 {mentor.name} ({mentor.domain}) - ⭐{mentor.rating}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No specific mentor match yet. Complete more skills for better matches!</p>
            )}
            <Button variant="default" size="small">Find My Mentor (32)</Button>
        </Card>
    );
};

export default MentorSuggestionList;