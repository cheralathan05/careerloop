import { useContext, useCallback, useMemo } from 'react';
import { AIContext } from '../context/AIContext';
import { useAuth } from './useAuth';
import { sendChatMessage } from '../services/aiService'; // Fixed in Step 5
import { showToast } from '../utils/toastNotifications'; // Keep this for user feedback

/**
 * @desc Custom hook to manage sending messages to the AI assistant
 * and updating the global chat history state.
 */
export const useAIChat = () => {
    const context = useContext(AIContext);
    if (!context) {
        // This check is required for safety if the hook is called outside the Provider
        throw new Error('useAIChat must be used within an AIProvider');
    }

    const { 
        chatHistory, 
        isThinking, 
        setIsThinking, 
        addMessage, 
        clearHistory, 
        error, 
        setError 
    } = context;
    const { user } = useAuth(); // Access current user info if needed by the component

    /**
     * Sends the user's prompt to the backend and handles the AI's response.
     * @param {string} userPrompt - The message typed by the user.
     */
    const sendMessage = useCallback(async (userPrompt) => {
        if (isThinking || !userPrompt.trim()) {
            if (!userPrompt.trim()) showToast("Message cannot be empty.", 'warning');
            return;
        }

        // 1. Add user message immediately to the history
        addMessage({ role: 'user', content: userPrompt });
        setIsThinking(true);
        setError(null);

        try {
            // 2. Call the AI Service (sends to POST /api/ai/chat)
            const aiResponse = await sendChatMessage(userPrompt); 
            
            // 3. Add AI's response to the history
            const replyContent = aiResponse.reply || "I've processed your request, but received an empty reply. How else can I assist?";
            addMessage({ role: 'ai', content: replyContent });

        } catch (err) {
            // 4. Handle API error (the service/apiClient already showed a toast)
            const errorMessage = err.message || "Sorry, I ran into an issue while processing your request. Please try again.";
            setError(errorMessage);
            // Add a friendly error message to the chat history itself
            addMessage({ 
                role: 'ai', 
                content: `🚨 **Error:** ${errorMessage} Please try rephrasing your question or check your connection.` 
            });
        } finally {
            setIsThinking(false);
        }
    }, [isThinking, addMessage, setIsThinking, setError]);

    return useMemo(() => ({
        chatHistory,
        isThinking,
        sendMessage,
        clearHistory,
        chatError: error,
    }), [chatHistory, isThinking, sendMessage, clearHistory, error]);
};
