import React from "react";
import { useOnboarding } from '../../hooks/useOnboarding'; // Fixed in step 19
import { OnboardingLayout } from '../../components/layout/OnboardingLayout';
import { Button } from '../../components/common/Button';
import { ArrowRight } from 'lucide-react';
// Assuming the path is correct based on your file structure
import { AIAssistantChat } from '../../components/ai-assistant/AIAssistantChat'; 

/**
 * @desc Phase 6: Interactive chat with the AI assistant.
 * Allows the user to ask questions about their summary before finalizing.
 */
const AIOnboardingAssistantPage = () => {
    // Get flow control from the fixed hook
    const { nextPhase } = useOnboarding();

    return (
        <OnboardingLayout title="AI Assistant Chat" className="max-w-4xl">
            {/* The core chat component which uses the fixed useAIChat hook */}
            <AIAssistantChat />
            
            {/* The button to advance to the final transition screen (Phase 7) */}
            <Button 
                onClick={nextPhase} 
                icon={ArrowRight} 
                className="w-full mt-6"
                variant="primary"
            >
                Finish Onboarding
            </Button>
        </OnboardingLayout>
    );
};

export default AIOnboardingAssistantPage;
