// server/services/feedbackService.js (ES Module Format)
import Feedback from '../models/Feedback.js'; // Use ES Module import
import { log as analyticsLog } from './analyticsService.js'; // Import the logger
import sendEmail from '../utils/sendEmail.js'; // Utility for notifications

/**
 * @desc Saves user feedback to the database and triggers necessary notifications.
 * @param {string | null} userId - The ID of the authenticated user.
 * @param {object} feedbackData - The data from the request body (type, rating, comments, etc.).
 * @returns {Promise<object>} The saved feedback document.
 */
export const save = async (userId, data) => {

    // 1. Create the database record
    const newFeedback = await Feedback.create({
        user: userId,
        phase: data.phase, // Assuming the controller passes phase
        rating: data.rating,
        comments: data.comments,
        status: 'New',
        // Spread any other properties
        ...data 
    });

    // 2. Non-blocking Internal Notifications and Analytics

    // Track the submission (Fire-and-forget: we don't await this)
    analyticsLog(userId, 'feedback_submitted', { 
        type: data.type || 'general', 
        rating: data.rating 
    });
    
    // Send an admin/support email notification (Fire-and-forget)
    if (process.env.FEEDBACK_NOTIFICATION_EMAIL) {
        const subject = `[NEW FEEDBACK] ${data.type || 'General'} - Rating: ${data.rating || 'N/A'}`;
        const message = `User ID: ${userId || 'Guest'}\nComments: ${data.comments}`;

        sendEmail({ 
            to: process.env.FEEDBACK_NOTIFICATION_EMAIL, 
            subject: subject, 
            text: message 
        }).catch(err => console.error("Failed to send feedback notification:", err.message));
    }

    // 3. Return the saved document to the controller
    return newFeedback;
};