// src/context/AIContext.jsx

import React, { createContext, useContext, useState } from 'react';

const AIContext = createContext();

export const AIProvider = ({ children }) => {
    const [isModelOnline, setIsModelOnline] = useState(true);
    const [rateLimitExceeded, setRateLimitExceeded] = useState(false);
    
    // Global function to trigger an AI interaction
    const triggerGlobalAI = (action, payload) => {
        console.log(`[AI Global] Action triggered: ${action}`, payload);
        // Logic to route the request to aiService or another module
        if (!isModelOnline) {
            alert("AI Model is currently offline.");
            return;
        }
        // Mock success
        return { status: 'processing', message: 'Request accepted.' };
    };

    return (
        <AIContext.Provider value={{ isModelOnline, rateLimitExceeded, triggerGlobalAI, setIsModelOnline, setRateLimitExceeded }}>
            {children}
        </AIContext.Provider>
    );
};

export const useAI = () => useContext(AIContext);