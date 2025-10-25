import apiClient from './apiClient';

const FEEDBACK_BASE_URL = 'feedback'; 

/**
 * @desc Submits user feedback (AI rating, comments, etc.) to the backend.
 * @param {object} payload - The feedback data.
 * @returns {Promise<object>} Server response.
 */
export const submitFeedback = async (payload) => {
    try {
        // POST /api/feedback/submit
        const response = await apiClient.post(`${FEEDBACK_BASE_URL}/submit`, payload);
        // The apiClient already handles success/error toasting
        return response.data || response;
    } catch (error) {
        // Re-throw the error for the modal component to catch and log
        throw error;
    }
};

export default { submitFeedback };

import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal'; // Assuming correct import
import { Button } from '../common/Button';
import { InputField } from '../ui/InputField'; // FIX: Changed Input to InputField for consistency
import { Star, Sparkles } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth'; // Fixed hook
import { submitFeedback } from '../../services/feedbackService'; // CRITICAL FIX: Service function imported
import { showToast } from '../../utils/toastNotifications'; // Fixed utility

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
        // Basic checks
        if (!user || !user.id) { // Check for user ID, not just existence
            showToast("You must be logged in to submit feedback.", 'error');
            return;
        }

        if (!comments.trim() && rating < 5) { // Encourage comments for lower ratings
            showToast("Please provide comments when rating below 5, it helps us improve!", 'warning');
            return;
        }

        setIsSubmitting(true);
        try {
            const payload = {
                type: 'ai_assistant_feedback',
                rating,
                comments: comments.trim() || `[No Comment - Rating ${rating}/5]`,
                userId: user.id, // Include user ID for tracking
                phase: 'AI Assistant Chat', // Contextual data
            };

            await submitFeedback(payload);

            showToast('Thank you for improving the AI!', 'success');
            handleClose();

        } catch (error) {
            // The service/apiClient handles the network toast, here we handle the cleanup
            // Log the error for debugging
            console.error("AIFeedbackModal Submission Failed:", error);
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
                    <label htmlFor="ai-rating-range" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
                        <Sparkles className="w-5 h-5 mr-1 text-indigo-500" /> Quality Rating:
                    </label>
                    <div className="flex items-center space-x-1">
                        <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{rating}</span>
                        <span className="text-gray-500">/ 5</span>
                    </div>
                </div>
                
                {/* Rating Input */}
                <input 
                    id="ai-rating-range" // FIX: Added ID for accessibility
                    type="range"
                    min={1}
                    max={5}
                    step={1}
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer range-lg dark:bg-gray-700"
                    aria-label="AI Assistant Quality Rating"
                />

                {/* Optional Comments */}
                <InputField 
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
