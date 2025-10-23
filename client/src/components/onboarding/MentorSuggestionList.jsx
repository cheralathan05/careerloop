import React, { useEffect, useState } from 'react';
import { Card } from '../common/Card';
import { Users, Star, ArrowRight } from 'lucide-react';
import { mentorService } from '../../services/mentorService'; // Assuming service exists
import { OnboardingLoader } from '../loaders/OnboardingLoader';

/**
 * @typedef {object} Mentor
 * @property {string} name
 * @property {string} domain
 * @property {number} rating
 */

/**
 * @desc Displays a list of top mentor recommendations based on user's skill gaps/domains.
 */
export const MentorSuggestionList = ({ title = "Top Mentor Matches", maxDisplay = 3 }) => {
    const [mentors, setMentors] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchMentors = async () => {
            setIsLoading(true);
            try {
                // Call the service (GET /api/mentors?q=...)
                const userSkills = ["react", "node.js"]; // Placeholder for user's actual skills
                const recommendedMentors = await mentorService.recommendMentors(userSkills);
                
                setMentors(recommendedMentors);
            } catch (error) {
                console.error("Failed to fetch mentors:", error);
                // Mock fallback
                setMentors([
                    { id: 1, name: "Dr. Evelyn Reed", domain: "Data Science", rating: 4.8 },
                    { id: 2, name: "Marcus Chen", domain: "Web Development", rating: 4.5 },
                ]);
            } finally {
                setIsLoading(false);
            }
        };
        fetchMentors();
    }, []);

    if (isLoading) return <Card><OnboardingLoader message="Finding top mentors..."/></Card>;

    return (
        <Card title={title} titleIcon={Users}>
            {mentors.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400">No mentors matched your current profile.</p>
            ) : (
                <div className="space-y-4">
                    {mentors.slice(0, maxDisplay).map((mentor) => (
                        <div key={mentor.id} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border dark:border-gray-600 flex justify-between items-center">
                            <div>
                                <p className="font-medium text-gray-800 dark:text-gray-100">{mentor.name}</p>
                                <p className="text-xs text-indigo-600 dark:text-indigo-400">{mentor.domain}</p>
                            </div>
                            <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                                <Star className="w-4 h-4 mr-1 text-yellow-500 fill-yellow-500" />
                                <span>{mentor.rating.toFixed(1)}</span>
                                <Button variant="primary" size="sm" className="ml-3">
                                    View
                                </Button>
                            </div>
                        </div>
                    ))}
                    <Button variant="secondary" className="w-full mt-4" icon={ArrowRight}>
                        Browse All Mentors
                    </Button>
                </div>
            )}
        </Card>
    );
};