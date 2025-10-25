import React from "react";
import { useOnboarding } from '../../hooks/useOnboarding'; // Fixed hook
import { OnboardingLayout } from '../../components/layout/OnboardingLayout';
import { Button } from '../../components/common/Button';
import { ArrowRight } from 'lucide-react';
// CRITICAL FIX: Named import is used, assuming the component file uses 'export const AIAssistantChat'
import AIAssistantChat from '../../components/onboarding/AIAssistantChat'; 

/**
 * @desc Phase 6: Interactive chat with the AI assistant.
 */
const AIOnboardingAssistantPage = () => {
    const { nextPhase } = useOnboarding();

    return (
        <OnboardingLayout title="AI Assistant Chat" className="max-w-4xl">
            <AIAssistantChat />
            
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