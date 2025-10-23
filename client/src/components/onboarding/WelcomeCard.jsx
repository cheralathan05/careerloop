import React from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { ArrowRight, Sparkles } from 'lucide-react';

/**
 * @desc Component displaying the welcome message and start button for Phase 1.
 * @param {function} onStart - Function to call to advance the onboarding flow.
 */
export const WelcomeCard = ({ onStart }) => {
    const { user } = useAuth();

    return (
        <Card className="text-center p-8">
            <img 
                src="/illustrations/onboarding-welcome.svg" 
                alt="Welcome" 
                className="mx-auto h-48 mb-6" 
                onError={(e) => e.target.style.display = 'none'} 
            />
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Welcome, {user?.name || 'Explorer'}!
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                Let's get started. Your career roadmap will be generated in just a few minutes using our AI engine.
            </p>
            <Button onClick={onStart} icon={Sparkles} className="w-full md:w-auto" size="lg">
                Start Personalization
            </Button>
        </Card>
    );
};