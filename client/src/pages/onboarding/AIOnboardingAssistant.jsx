import React from "react";
import { useOnboarding } from '../../hooks/useOnboarding';
import { OnboardingLayout } from '../../components/layout/OnboardingLayout';
import { Button } from '../../components/common/Button';
import { ArrowRight } from 'lucide-react';
import { AIAssistantChat } from '../../components/ai-assistant/AIAssistantChat'; // ✅ Added missing import

/**
 * @desc Phase 6: Interactive chat with the AI assistant.
 */
const AIOnboardingAssistantPage = () => {
    const { nextPhase } = useOnboarding();

    return (
        <OnboardingLayout title="AI Assistant Chat" className="max-w-4xl">
            <AIAssistantChat />
            
            <Button onClick={nextPhase} icon={ArrowRight} className="w-full mt-6">
                Finish Onboarding
            </Button>
        </OnboardingLayout>
    );
};

export default AIOnboardingAssistantPage;
