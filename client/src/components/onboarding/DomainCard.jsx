// src/components/onboarding/DomainCard.jsx

import React from 'react';
import Card from '../ui/Card';

const DomainCard = ({ domain, isSelected, onSelect }) => {
    const handleClick = () => {
        onSelect(domain.id);
    };

    return (
        <Card 
            className={`domain-card ${isSelected ? 'selected' : ''}`}
            onClick={handleClick}
        >
            <h4>{domain.name}</h4>
            <p className="skill-list-title">Key Skills:</p>
            <div className="skill-tags">
                {domain.skills.slice(0, 3).map(skill => (
                    <span key={skill} className="skill-tag">{skill}</span>
                ))}
            </div>
            <div className="selection-indicator">
                {isSelected ? '✅ Selected' : '➕ Select'}
            </div>
        </Card>
    );
};

export default DomainCard;