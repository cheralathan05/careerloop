// src/components/onboarding/AIAssistantChat.jsx

import React, { useState } from 'react';
import AILoader from '../loaders/AILoader';

const AIAssistantChat = ({ messages, onSendMessage, isTyping, initialGuidance }) => {
    const [input, setInput] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (input.trim()) {
            onSendMessage(input);
            setInput('');
        }
    };

    return (
        <div className="ai-assistant-chat-container">
            <div className="messages-display">
                {messages.map(msg => (
                    <div key={msg.id} className={`chat-message chat-message-${msg.sender}`}>
                        <span className="sender-icon">{msg.sender === 'ai' ? '🤖' : '👤'}</span>
                        <p>{msg.text}</p>
                    </div>
                ))}
                {isTyping && <AILoader message="AI is typing..." />}
                
                {messages.length === 0 && (
                    <div className="initial-guidance-bubble">
                        <p>🤖 AI: Your initial guidance is loaded. Try asking: "{initialGuidance[0] || 'What is my highest priority task?'}"</p>
                    </div>
                )}
            </div>
            <form onSubmit={handleSubmit} className="chat-input-form">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask your AI Career Coach..."
                    disabled={isTyping}
                />
                <button type="submit" disabled={isTyping}>Send</button>
            </form>
        </div>
    );
};

export default AIAssistantChat;