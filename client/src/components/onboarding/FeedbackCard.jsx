// src/components/onboarding/FeedbackCard.jsx

import React, { useState } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';

const FeedbackCard = () => {
    const [feedback, setFeedback] = useState('');

    const handleSubmit = () => {
        if (feedback.length > 5) {
            alert("Feedback submitted! Thank you.");
            setFeedback('');
        } else {
            alert("Please enter more detailed feedback.");
        }
    };

    return (
        <Card title="Quick Feedback" className="feedback-card">
            <p>Help us improve your experience!</p>
            <textarea 
                placeholder="What was the best or worst part of onboarding?"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                rows="3"
            />
            <Button onClick={handleSubmit} variant="secondary">Submit Feedback</Button>
        </Card>
    );
};

export default FeedbackCard;