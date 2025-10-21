// src/hooks/useAIChat.js

import { useState, useCallback, useEffect } from 'react';
import aiService from '../services/aiService';

export default function useAIChat(userData, initialGuidance = []) {
    const [messages, setMessages] = useState([]);
    const [isTyping, setIsTyping] = useState(false);

    // Initialize chat with the AI's first message (based on Phase 9 recommendations)
    useEffect(() => {
        if (messages.length === 0 && initialGuidance.length > 0) {
            const initialMessage = {
                id: 'ai-initial',
                sender: 'ai',
                text: `Hello ${userData.fullName}! Your initial plan is set: ${initialGuidance.join(' ')}. What would you like to refine first?`,
                timestamp: new Date().toISOString()
            };
            setMessages([initialMessage]);
        }
    }, [userData, initialGuidance]);


    const sendMessage = useCallback(async (text) => {
        if (!text.trim()) return;

        // 1. Add user message
        const userMessage = { id: Date.now(), sender: 'user', text, timestamp: new Date().toISOString() };
        setMessages(prev => [...prev, userMessage]);

        setIsTyping(true);

        try {
            // 2. Get AI response
            const response = await aiService.getAIChatResponse([...messages, userMessage], userData);
            
            // 3. Add AI response
            const aiMessage = { 
                id: Date.now() + 1, 
                sender: 'ai', 
                text: response.text, 
                timestamp: response.timestamp 
            };
            setMessages(prev => [...prev, aiMessage]);

        } catch (error) {
            console.error("AI Chat Error:", error);
            const errorMessage = { id: Date.now() + 1, sender: 'ai', text: "I'm sorry, I'm experiencing technical difficulties. Please try again later.", timestamp: new Date().toISOString() };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsTyping(false);
        }
    }, [messages, userData]);

    return {
        messages,
        sendMessage,
        isTyping
    };
}