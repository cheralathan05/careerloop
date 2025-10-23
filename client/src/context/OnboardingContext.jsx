import React, { useState, useContext, useMemo, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth'; 
import { initialOnboardingState, ONBOARDING_FLOW_MAP } from '../utils/constants'; 
import { showToast } from '../utils/toastNotifications';

// Define the Onboarding Context
export const OnboardingContext = React.createContext(null);

// Provider Component
export const OnboardingProvider = ({ children }) => {
    const [state, setState] = useState(initialOnboardingState);
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useAuth(); 

    // Calculate current progress for the progress bar
    const currentStepIndex = ONBOARDING_FLOW_MAP.findIndex(step => step.phase === state.currentPhase);
    const totalSteps = ONBOARDING_FLOW_MAP.length;
    const currentProgress = Math.round((currentStepIndex + 1) / totalSteps * 100);

    // --- State Updaters ---

    const nextPhase = useCallback(() => {
        if (state.currentPhase >= totalSteps) return;
        
        setState(prev => ({ 
            ...prev, 
            currentPhase: prev.currentPhase + 1 
        }));
        showToast(`Moving to Phase ${state.currentPhase + 1}`, 'info');
    }, [state.currentPhase, totalSteps]);

    const prevPhase = useCallback(() => {
        if (state.currentPhase <= 1) return;
        
        setState(prev => ({ 
            ...prev, 
            currentPhase: prev.currentPhase - 1 
        }));
    }, [state.currentPhase]);

    // Generic state setter for details, domains, quiz, summary, etc.
    const setOnboardingData = useCallback((key, data) => {
        setState(prev => ({
            ...prev,
            // Merge objects if updating nested data like 'details' or 'skillScores'
            [key]: typeof data === 'function' ? data(prev[key]) : data
        }));
    }, []);

    const contextValue = useMemo(() => ({
        onboardingState: state,
        user: user,
        isLoading,
        setIsLoading,
        currentProgress,
        nextPhase,
        prevPhase,
        setOnboardingData,
        details: state.details,
        domains: state.domains,
        quiz: state.quiz,
        summary: state.summary,
    }), [state, user, isLoading, currentProgress, nextPhase, prevPhase, setOnboardingData]);

    return (
        <OnboardingContext.Provider value={contextValue}>
            {children}
        </OnboardingContext.Provider>
    );
};