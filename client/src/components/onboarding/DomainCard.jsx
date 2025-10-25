import React from 'react';
import { Card } from '../common/Card';
import { CheckCircle, TrendingUp, Cpu, Lightbulb, Globe } from 'lucide-react';

// Map domain names to relevant icons
const IconMap = {
    'Web Development': Globe,
    'Data Science': Cpu,
    'UI/UX': Lightbulb,
    'Cloud Engineering': TrendingUp,
    'Cyber Security': CheckCircle, // Added a fallback security icon
};

/**
 * @desc Component for displaying a single AI-recommended domain and handling selection.
 * @param {string} domain - The name of the career domain.
 * @param {number} score - The AI match score (0-10).
 * @param {boolean} isSelected - Whether the domain is currently selected by the user.
 * @param {function} onSelect - Callback function to handle click/selection.
 */
export const DomainCard = ({ domain, score = 0, isSelected, onSelect }) => {
    // Fallback Icon is TrendingUp if the domain name isn't in the map
    const Icon = IconMap[domain] || TrendingUp; 
    
    // Ensure score is formatted nicely
    const normalizedScore = Math.round(score * 10) / 10; 

    return (
        <Card 
            className={`cursor-pointer transition-all duration-200 p-4 ${
                // Apply a distinct, thicker border and background if selected
                isSelected 
                    ? 'border-4 border-indigo-500 shadow-xl bg-indigo-50 dark:bg-indigo-900/30' 
                    : 'hover:shadow-lg hover:border-indigo-300 dark:hover:border-gray-600'
            }`}
            onClick={() => onSelect(domain)}
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    {/* Domain Icon */}
                    <Icon className={`w-8 h-8 mr-4 ${isSelected ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-500 dark:text-gray-400'}`} />
                    
                    {/* Domain Name and Score */}
                    <div>
                        <h3 className="text-lg font-semibold dark:text-white">{domain}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Match Score: {normalizedScore}/10</p>
                    </div>
                </div>
                
                {/* Checkmark indicator */}
                {isSelected && <CheckCircle className="w-6 h-6 text-indigo-500 fill-indigo-500 flex-shrink-0" />}
            </div>
            
            {/* Contextual Description */}
            <p className="text-xs mt-3 text-gray-500 dark:text-gray-400">
                {normalizedScore > 7.0 ? 'High match based on your skills and interests.' : 'Good potential match, explore if interested.'}
            </p>
        </Card>
    );
};
