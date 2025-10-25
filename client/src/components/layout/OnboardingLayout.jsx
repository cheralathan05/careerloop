import React from 'react';
import { useOnboarding } from '../../hooks/useOnboarding.jsx'; 
import { useTheme } from '../../context/ThemeContext';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { ProgressRing } from '../ui/ProgressRing';
import { ArrowLeft, Moon, Sun } from 'lucide-react';
import { ONBOARDING_FLOW_MAP } from '../../utils/constants';

/**
 * @desc Layout wrapper for all steps of the onboarding flow (Steps 1 through N).
 */
export const OnboardingLayout = ({ children, title, className = '' }) => {
    const { 
        onboardingState: { currentPhase }, 
        currentProgress, 
        prevPhase, 
        isLoading 
    } = useOnboarding();

    const { theme, toggleTheme } = useTheme();
    const totalSteps = ONBOARDING_FLOW_MAP.length;
    const isFirstStep = currentPhase === 1;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center p-4 sm:p-8 font-sans">
            
            {/* Header with Logo and Theme Toggle */}
            <div className="w-full max-w-6xl flex justify-between items-center mb-8">
                <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
                    CareerLoop
                </div>

                <div className="flex items-center space-x-4">
                    {/* Theme Toggle */}
                    <Button 
                        onClick={toggleTheme} 
                        variant="secondary" 
                        className="p-2 w-10 h-10" 
                        size="sm"
                        aria-label="Toggle Theme"
                    >
                        {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                    </Button>

                    {/* Progress Ring for larger screens */}
                    <div className="hidden sm:block">
                        <ProgressRing progress={currentProgress} size={50} strokeWidth={5} />
                    </div>
                </div>
            </div>

            {/* Main Card */}
            <Card className={`w-full max-w-xl md:max-w-3xl flex flex-col shadow-2xl ${className}`}>
                
                {/* Title & Step Info */}
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-1">{title}</h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Step {currentPhase} of {totalSteps}
                        </p>
                    </div>

                    {/* Mobile Progress Ring */}
                    <div className="sm:hidden">
                        <ProgressRing progress={currentProgress} size={50} strokeWidth={5} />
                    </div>
                </div>
                
                {/* Back Button */}
                {!isFirstStep && !isLoading && (
                    <Button 
                        onClick={prevPhase} 
                        variant="outline" 
                        size="sm" 
                        icon={ArrowLeft}
                        className="mb-6"
                        aria-label="Go to previous step"
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
