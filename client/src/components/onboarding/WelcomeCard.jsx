import React from 'react';
// CRITICAL FIX: Corrected path from '../../../hooks/' to '../../hooks/'
import useAuth from '../../hooks/useAuth'; // Corrected to two levels up (../..)
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { ArrowRight, Sparkles } from 'lucide-react';

/**
 * @desc Component displaying the welcome message and start button for Phase 1.
 * @param {function} onStart - Function to call to advance the onboarding flow (from WelcomePage).
 */
export const WelcomeCard = ({ onStart }) => {
    // Get the user object from the fixed Auth hook
    const { user } = useAuth();

    return (
        <Card className="text-center p-8 max-w-xl mx-auto">
            {/* Illustration Area */}
            <img 
                src="/illustrations/onboarding-welcome.svg" 
                alt="Welcome to CareerLoop" 
                className="mx-auto h-48 mb-6" 
                // Graceful fallback if image link is broken
                onError={(e) => e.currentTarget.style.display = 'none'} 
            />
            
            {/* Title & Welcome Message */}
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Welcome, {user?.name || 'Explorer'}!
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                Let's get started. Your personalized career roadmap will be generated in just a few minutes using our powerful AI engine.
            </p>
            
            {/* Start Button */}
            <Button 
                onClick={onStart} 
                icon={Sparkles} 
                className="w-full md:w-auto animate-pulse-shadow" // Added custom animation class
                size="lg"
                variant="primary"
            >
                Start Personalization
            </Button>
        </Card>
    );
};