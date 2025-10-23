import React, { useState } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { MessageSquare, ThumbsUp } from 'lucide-react';
import { AIFeedbackModal } from '../modals/AIFeedbackModal';

/**
 * @desc A persistent or dashboard component to solicit quick feedback.
 */
export const FeedbackCard = ({ title = "Help Us Improve" }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <Card title={title} titleIcon={MessageSquare} className="border-t-4 border-indigo-500">
            <p className="text-gray-700 dark:text-gray-300 mb-4 text-sm">
                Spot a bug or have a suggestion for the AI? Your feedback is valuable!
            </p>
            
            <Button 
                onClick={() => setIsModalOpen(true)} 
                variant="primary" 
                size="sm"
                icon={ThumbsUp}
            >
                Submit Feedback
            </Button>

            <AIFeedbackModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </Card>
    );
};