import { useContext, useState, useCallback, useMemo } from 'react';
import { AIContext } from '../context/AIContext';
import { useAuth } from './useAuth';
import { sendChatMessage } from '../services/aiService'; // Assuming service exists
import { showToast } from '../utils/toastNotifications';

/**
 * @desc Custom hook to manage sending messages to the AI assistant
 * and updating the global chat history state.
 */
export const useAIChat = () => {
    const context = useContext(AIContext);
    if (!context) {
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
    const { user } = useAuth();

    /**
     * Sends the user's prompt to the backend and handles the AI's response.
     * @param {string} userPrompt - The message typed by the user.
     */
    const sendMessage = useCallback(async (userPrompt) => {
        if (isThinking || !userPrompt.trim()) return;

        // 1. Add user message immediately to the history
        addMessage({ role: 'user', content: userPrompt });
        setIsThinking(true);
        setError(null);

        try {
            // 2. Call the AI Service
            // NOTE: The service will automatically include the user's context (ID, profile, etc.)
            const aiResponse = await sendChatMessage(userPrompt); 
            
            // 3. Add AI's response to the history
            addMessage({ role: 'ai', content: aiResponse.reply || "I've processed your request. How else can I assist?" });

        } catch (err) {
            setError(err.message);
            addMessage({ role: 'ai', content: "Sorry, I ran into an issue while processing your request. Please try again." });
        } finally {
            setIsThinking(false);
        }
    }, [isThinking, addMessage, setIsThinking]);

    return useMemo(() => ({
        chatHistory,
        isThinking,
        sendMessage,
        clearHistory,
        chatError: error,
    }), [chatHistory, isThinking, sendMessage, clearHistory, error]);
};