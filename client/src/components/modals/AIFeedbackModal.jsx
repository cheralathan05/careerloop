import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Star, Sparkles } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { submitFeedback } from '../../services/feedbackService';
import { showToast } from '../../utils/toastNotifications';

/**
 * @desc Modal for submitting user feedback about the AI Assistant's performance.
 * @param {boolean} isOpen - Controls whether the modal is visible.
 * @param {function} onClose - Callback to close the modal.
 */
export const AIFeedbackModal = ({ isOpen, onClose }) => {
    const { user } = useAuth();
    const [rating, setRating] = useState(5);
    const [comments, setComments] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Reset state whenever the modal is opened or closed
    useEffect(() => {
        if (!isOpen) {
            setRating(5);
            setComments('');
            setIsSubmitting(false);
        }
    }, [isOpen]);

    const handleClose = () => {
        onClose();
    };

    const handleSubmitFeedback = async () => {
        if (!user) {
            showToast("You must be logged in to submit feedback.", 'error');
            return;
        }

        if (!comments && rating === 5) {
            showToast("Awesome! Tell us more in the comments!", 'warn');
            return;
        }

        setIsSubmitting(true);
        try {
            const payload = {
                type: 'ai_assistant_feedback',
                rating,
                comments: comments.trim() || `[No Comment - Rating ${rating}/5]`,
                phase: 'AI Assistant Chat',
            };

            await submitFeedback(payload);

            showToast('Thank you for improving the AI!', 'success');
            handleClose();

        } catch (error) {
            showToast(error.message || 'Failed to submit feedback.', 'error');
            console.error("AIFeedbackModal Error:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal 
            isOpen={isOpen} 
            onClose={handleClose} 
            title="Rate the AI Assistant"
            size="sm"
        >
            <div className="space-y-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    Your input helps us refine the AI's recommendations and chat quality.
                </p>

                {/* Rating Section */}
                <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
                        <Sparkles className="w-5 h-5 mr-1 text-indigo-500" /> Quality Rating:
                    </label>
                    <div className="flex items-center space-x-1">
                        <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{rating}</span>
                        <span className="text-gray-500">/ 5</span>
                    </div>
                </div>
                <Input 
                    type="range"
                    min={1}
                    max={5}
                    step={1}
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    className="mb-2"
                    aria-label="AI Assistant Quality Rating"
                />

                {/* Optional Comments */}
                <Input 
                    label="Comments (Optional)"
                    type="textarea"
                    rows={4}
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    placeholder="E.g., It helped me prioritize React tasks, but the Node.js security advice was vague."
                />

                {/* Submit Button */}
                <Button 
                    onClick={handleSubmitFeedback} 
                    loading={isSubmitting} 
                    disabled={isSubmitting} 
                    className="w-full mt-4"
                    icon={Star}
                >
                    Submit Feedback
                </Button>
            </div>
        </Modal>
    );
};
