// src/components/onboarding/SkillAssessmentCard.jsx

import React from 'react';
import Card from '../ui/Card';

const SkillAssessmentCard = ({ question, progress }) => {
    return (
        <Card className="skill-assessment-card">
            <p className="assessment-progress">Question {progress.current} of {progress.total}</p>
            <h3>{question.text}</h3>
            {/* Options would be rendered here */}
            <div className="options-placeholder">
                <p>Click the option that best reflects your skill.</p>
            </div>
        </Card>
    );
};

export default SkillAssessmentCard;