import React, { useState, useContext, useMemo, useCallback } from 'react';
import useAuth from '../hooks/useAuth'; // <-- Correct: Getting the default export
// import { showToast } from '../utils/toastNotifications'; // FIX: Removed unused import

// Define the shape of a chat message
/**
 * @typedef {object} ChatMessage
 * @property {'user' | 'ai'} role - Who sent the message.
 * @property {string} content - The message text.
 * @property {number} timestamp - Unix timestamp.
 */

// Define the AI Context
export const AIContext = React.createContext(null);

// Custom hook for easy access (used internally and exported by useAIChat.js)
export const useAIContext = () => {
    const context = useContext(AIContext);
    if (!context) {
        throw new Error('useAIContext must be used within an AIProvider');
    }
    return context;
};

// Provider Component
export const AIProvider = ({ children }) => {
    const [history, setHistory] = useState([
        { 
            role: 'ai', 
            content: "Hello! I'm your CareerLoop AI Assistant. I can answer questions about your skills, domains, or next career steps. Ask me anything!",
            timestamp: Date.now() 
        }
    ]);
    const [isThinking, setIsThinking] = useState(false);
    const [error, setError] = useState(null);
    const { user } = useAuth(); // Used to tag requests or personalize initial message

    /**
     * Adds a new message (user or AI) to the history.
     */
    const addMessage = useCallback((message) => {
        // Ensure the message has necessary properties
        if (!message.role || !message.content) return;
        
        setHistory(prev => [...prev, { ...message, timestamp: Date.now() }]);
        setError(null);
    }, []);

    /**
     * Resets the chat history back to the initial AI welcome message.
     */
    const clearHistory = useCallback(() => {
        setHistory([
            { 
                role: 'ai', 
                content: "Chat history cleared. How can I help you start fresh?",
                timestamp: Date.now() 
            }
        ]);
        // FIX: Removed showToast
    }, []);
    
    // The actual chat logic (sending/receiving) will be in useAIChat.js

    const contextValue = useMemo(() => ({
        chatHistory: history,
        isThinking,
        setIsThinking, 
        addMessage,
        clearHistory,
        error,
        setError,
        currentUser: user // Expose current user for personalized interactions
    }), [history, isThinking, addMessage, clearHistory, error, user]);

    return (
        <AIContext.Provider value={contextValue}>
            {children}
        </AIContext.Provider>
    );
};
