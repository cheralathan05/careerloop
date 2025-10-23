import React, { useState, useRef, useEffect } from 'react';
import { useAIChat } from '../../../hooks/useAIChat';
import { Card } from '../../common/Card';
import { Button } from '../../common/Button';
import { Input } from '../../common/Input';
import { AILoader } from '../../loaders/AILoader';
import { Send, Cpu, MessageSquare, XCircle, Trash2 } from 'lucide-react';
import { AIFeedbackModal } from '../../modals/AIFeedbackModal';

/**
 * @desc Component that displays the interactive chat interface for the AI assistant.
 */
export const AIAssistantChat = () => {
    const { chatHistory, isThinking, sendMessage, clearHistory } = useAIChat();
    const [input, setInput] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const chatRef = useRef(null);
    
    // Scroll to bottom when messages update
    useEffect(() => {
        if (chatRef.current) {
            chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
    }, [chatHistory]);

    const handleSend = (e) => {
        e.preventDefault();
        if (input.trim() && !isThinking) {
            sendMessage(input.trim());
            setInput('');
        }
    };

    return (
        <div className="space-y-4">
            <AIFeedbackModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

            <Card className="p-0 h-[70vh] flex flex-col">
                {/* Chat History Area */}
                <div ref={chatRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-700/50">
                    {chatHistory.length === 0 && (
                        <div className="text-center text-gray-500 dark:text-gray-400 pt-8">
                            <MessageSquare className="w-10 h-10 mx-auto mb-2" />
                            <p>Ask me anything about your career path!</p>
                        </div>
                    )}
                    {chatHistory.map((msg, index) => (
                        <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-xs md:max-w-md p-3 rounded-xl shadow-md ${
                                msg.role === 'user' 
                                    ? 'bg-indigo-600 text-white rounded-br-none' 
                                    : 'bg-gray-200 dark:bg-gray-800 dark:text-gray-200 rounded-tl-none'
                            }`}>
                                {msg.role === 'ai' && <Cpu className="w-4 h-4 mr-1 inline text-indigo-400" />}
                                {msg.content}
                            </div>
                        </div>
                    ))}
                    {isThinking && (
                        <div className="flex justify-start">
                           <AILoader text="Thinking..." className="!p-3 !text-sm !bg-gray-100 dark:!bg-gray-700" />
                        </div>
                    )}
                </div>

                {/* Input Form */}
                <form onSubmit={handleSend} className="p-4 border-t dark:border-gray-700 bg-white dark:bg-gray-800 flex">
                    <Input
                        placeholder="Type your question..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className="flex-1 mr-3 mb-0"
                    />
                    <Button type="submit" icon={Send} disabled={isThinking || !input.trim()}>
                        Send
                    </Button>
                </form>
            </Card>
            
            {/* Action Buttons */}
            <div className="flex justify-end space-x-3">
                <Button onClick={() => setIsModalOpen(true)} variant="secondary" size="sm">
                    Rate Assistant
                </Button>
                <Button onClick={clearHistory} variant="outline" size="sm" icon={Trash2}>
                    Clear Chat
                </Button>
            </div>
        </div>
    );
};