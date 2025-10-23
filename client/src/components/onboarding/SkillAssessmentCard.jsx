import React, { useState } from 'react';
import { Card } from '../common/Card';
import { BookOpen } from 'lucide-react';

/**
 * @desc Component for displaying a single question group within the skill assessment.
 * @param {object} group - An object containing a 'domain' and an array of 'questions'.
 * @param {object} currentAnswers - The current state of answers { questionId: answer }.
 * @param {function} onAnswer - Callback to update the parent component's answers.
 * @param {number} groupIndex - The index of this group (for unique IDs).
 */
export const SkillAssessmentCard = ({ group, currentAnswers, onAnswer, groupIndex }) => {
    return (
        <div className="space-y-4">
            <Card className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                <h3 className="text-lg font-semibold text-indigo-700 dark:text-indigo-400 mb-4 flex items-center">
                    <BookOpen className="w-5 h-5 mr-2" /> {group.domain.name} Questions
                </h3>
                
                {group.questions?.map((q, qIndex) => (
                    <div key={q.id} className="mb-6 pb-4 border-b dark:border-gray-600 last:border-b-0">
                        <p className="font-medium dark:text-white mb-3">
                            {qIndex + 1}. {q.text}
                        </p>
                        <div className="space-y-2">
                            {q.options.map((option, oIndex) => (
                                <div key={oIndex} className="flex items-center">
                                    <input
                                        type="radio"
                                        id={`q${q.id}-${oIndex}`}
                                        name={`question-${q.id}`}
                                        value={option}
                                        checked={currentAnswers[q.id] === option}
                                        // Update the parent's answer state
                                        onChange={() => onAnswer(q.id, option)} 
                                        className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                                    />
                                    <label htmlFor={`q${q.id}-${oIndex}`} className="ml-3 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                                        {option}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </Card>
        </div>
    );
};