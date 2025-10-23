import React, { useState, useContext, useMemo, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth'; 
import { showToast } from '../utils/toastNotifications';

// Define the shape of a chat message
/**
 * @typedef {object} ChatMessage
 * @property {'user' | 'ai'} role - Who sent the message.
 * @property {string} content - The message text.
 * @property {number} timestamp - Unix timestamp.
 */

// Define the AI Context
export const AIContext = React.createContext(null);

// Custom hook for easy access (Exported by useAIChat.js)
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
    const { user } = useAuth(); // Used to tag requests

    const addMessage = useCallback((message) => {
        setHistory(prev => [...prev, { ...message, timestamp: Date.now() }]);
        setError(null);
    }, []);

    const clearHistory = useCallback(() => {
        setHistory([
            { 
                role: 'ai', 
                content: "Chat history cleared. How can I help you start fresh?",
                timestamp: Date.now() 
            }
        ]);
        showToast('Chat history cleared.', 'info');
    }, []);
    
    // The actual chat logic (sending/receiving) will be in useAIChat.js

    const contextValue = useMemo(() => ({
        chatHistory: history,
        isThinking,
        setIsThinking, // Exposed for useAIChat to manage
        addMessage,
        clearHistory,
        error,
        setError
    }), [history, isThinking, addMessage, clearHistory, error]);

    return (
        <AIContext.Provider value={contextValue}>
            {children}
        </AIContext.Provider>
    );
};