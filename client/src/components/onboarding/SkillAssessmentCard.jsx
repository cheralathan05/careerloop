import React from 'react';
import { Card } from '../common/Card';
import { BookOpen } from 'lucide-react';

/**
 * @typedef {object} QuestionGroup
 * @property {{name: string}} domain - The domain name.
 * @property {Array<object>} questions - Array of question objects.
 */

/**
 * @desc Component for displaying a single question group within the skill assessment.
 * @param {QuestionGroup} group - An object containing a 'domain' and an array of 'questions'.
 * @param {object} currentAnswers - The current state of answers { questionId: answer }.
 * @param {function} onAnswer - Callback to update the parent component's answers.
 */
export const SkillAssessmentCard = ({ group, currentAnswers, onAnswer }) => {
    
    // Safety check for group structure
    if (!group || !group.domain || !Array.isArray(group.questions)) {
        return null;
    }

    return (
        <div className="space-y-4">
            {/* The outer Card is purely for group styling and separation */}
            <Card className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                {/* Domain Title */}
                <h3 className="text-lg font-semibold text-indigo-700 dark:text-indigo-400 mb-4 flex items-center">
                    <BookOpen className="w-5 h-5 mr-2 flex-shrink-0" /> {group.domain.name} Questions
                </h3>
                
                {/* Questions Loop */}
                {group.questions.map((q, qIndex) => {
                    // Generate a unique base ID for accessibility
                    const questionBaseId = `q-${q.id}`; 
                    
                    return (
                        <div key={q.id} className="mb-6 pb-4 border-b dark:border-gray-600 last:border-b-0">
                            <p className="font-medium dark:text-white mb-3">
                                {qIndex + 1}. {q.text}
                            </p>
                            <div className="space-y-2">
                                {/* Options Loop (Radio Buttons) */}
                                {q.options.map((option, oIndex) => (
                                    <div key={oIndex} className="flex items-center">
                                        <input
                                            type="radio"
                                            id={`${questionBaseId}-${oIndex}`}
                                            // The 'name' attribute ensures only one option can be selected per question
                                            name={`question-${q.id}`} 
                                            value={option}
                                            checked={currentAnswers[q.id] === option}
                                            // Call the parent handler to update state
                                            onChange={() => onAnswer(q.id, option)} 
                                            className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-600"
                                        />
                                        <label 
                                            htmlFor={`${questionBaseId}-${oIndex}`} 
                                            className="ml-3 text-sm text-gray-700 dark:text-gray-300 cursor-pointer"
                                        >
                                            {option}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </Card>
        </div>
    );
};
