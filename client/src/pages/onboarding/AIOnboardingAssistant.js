// src/pages/onboarding/AIOnboardingAssistant.js

import React, { useState } from 'react';
import useOnboarding from '../../hooks/useOnboarding';
import useAIChat from '../../hooks/useAIChat'; // Hook for chat logic
import OnboardingLayout from '../../components/layout/OnboardingLayout';
import AIAssistantChat from '../../components/onboarding/AIAssistantChat';
import Button from '../../components/ui/Button';
import toastNotifications from '../../utils/toastNotifications';

const AIOnboardingAssistant = () => {
    const { state, nextPhase, updateOnboardingState } = useOnboarding();
    const { 
        messages, 
        sendMessage, 
        isTyping, 
        // Assume context for initial guidance:
        initialGuidance = state.aiRecommendations?.tasks || []
    } = useAIChat(state.userData);

    const [isSaving, setIsSaving] = useState(false);

    const handleGoToDashboard = async () => {
        setIsSaving(true);
        
        // System Action 1: Save final AI interactions/tasks to the Planner
        // Mock API call to save tasks
        await new Promise(resolve => setTimeout(resolve, 1000)); 
        
        // System Action 2: Update context/database with final status
        updateOnboardingState({ 
            onboardingStatus: 'completed',
            aiTaskSet: initialGuidance, // Save the finalized task list
        });
        
        toastNotifications.success("Onboarding complete! Welcome to your Dashboard.");
        
        // System Action 3: Move to the final transition phase (10 -> 11)
        nextPhase(); 
        // Router will intercept the phase change (11) and navigate to '/transition'
    };

    return (
        <OnboardingLayout>
            <div className="ai-onboarding-assistant-page">
                <h2>Phase 10: Your AI Career Coach</h2>
                <p className="subtext">Your assistant, **CareerLoop AI**, has pre-loaded your first steps. Chat with it to refine your plan.</p>

                <AIAssistantChat 
                    messages={messages}
                    onSendMessage={sendMessage}
                    isTyping={isTyping}
                    initialGuidance={initialGuidance}
                />
                
                <Button 
                    onClick={handleGoToDashboard} 
                    variant="cta" 
                    size="large"
                    disabled={isSaving}
                >
                    {isSaving ? 'Finalizing...' : 'Go to Dashboard Home (11) 🏠'}
                </Button>
            </div>
        </OnboardingLayout>
    );
};

export default AIOnboardingAssistant;