import React from 'react';
import { useOnboarding } from '../../hooks/useOnboarding.jsx'; // Fixed hook
import { useTheme } from '../../context/ThemeContext'; // Fixed context
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { ProgressRing } from '../ui/ProgressRing'; // Fixed component
import { ArrowLeft, Moon, Sun, TrendingUp } from 'lucide-react'; // Added TrendingUp for logo
import { ONBOARDING_FLOW_MAP } from '../../utils/constants'; // Fixed constants

/**
 * @desc Layout wrapper for all steps of the onboarding flow (Steps 1 through N).
 * @param {React.ReactNode} children - The content of the current onboarding step/page.
 * @param {string} title - The main title of the current step.
 * @param {string} className - Optional classes for the main content card width.
 */
export const OnboardingLayout = ({ children, title, className = '' }) => {
    // State from fixed hooks
    const { 
        onboardingState: { currentPhase }, 
        currentProgress, 
        prevPhase, 
        isLoading // Used to disable navigation during server calls
    } = useOnboarding();

    const { theme, toggleTheme } = useTheme();
    
    const totalSteps = ONBOARDING_FLOW_MAP.length;
    const isFirstStep = currentPhase === 1;

    return (
        // Main container for centered content
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center p-4 sm:p-8 font-sans">
            
            {/* --- TOP BAR (Logo, Progress, Theme Toggle) --- */}
            <div className="w-full max-w-6xl flex justify-between items-center mb-8">
                {/* Logo */}
                <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400 flex items-center space-x-2">
                    <TrendingUp className="w-6 h-6" />
                    <span>CareerLoop</span>
                </div>

                <div className="flex items-center space-x-4">
                    {/* Theme Toggle */}
                    <Button 
                        onClick={toggleTheme} 
                        variant="secondary" 
                        className="p-2 w-10 h-10 flex-shrink-0" 
                        size="sm"
                        aria-label="Toggle Theme"
                    >
                        {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                    </Button>

                    {/* Progress Ring (Used for overall progress tracking) */}
                    <div className="sm:block"> 
                        <ProgressRing progress={currentProgress} size={50} strokeWidth={5} />
                    </div>
                </div>
            </div>

            {/* --- MAIN CONTENT CARD --- */}
            <Card className={`w-full max-w-xl md:max-w-3xl flex flex-col shadow-2xl ${className}`}>
                
                {/* Title & Step Info */}
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-1">{title}</h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Step {currentPhase} of {totalSteps}
                        </p>
                    </div>
                </div>
                
                {/* Back Button (Disabled on first step and while loading/saving data) */}
                {!isFirstStep && !isLoading && (
                    <Button 
                        onClick={prevPhase} 
                        variant="outline" 
                        size="sm" 
                        icon={ArrowLeft}
                        className="mb-6 self-start"
                        aria-label="Go to previous step"
                        disabled={isLoading}
                    >
                        Back
                    </Button>
                )}

                {/* Content Slot */}
                <div className="w-full">
                    {children}
                </div>
            </Card>
        </div>
    );
};
