import React, { createContext, useState, useMemo, useCallback } from 'react';
import useAuth from '../hooks/useAuth'; // <-- Correct: Getting the default export
// NOTE: We assume these utility files exist and will be provided later.
// We remove the showToast import as it's not used elsewhere in this context.
import { initialOnboardingState, ONBOARDING_FLOW_MAP } from '../utils/constants'; 

// Define the Onboarding Context
export const OnboardingContext = createContext(null);

// Provider Component
export const OnboardingProvider = ({ children }) => {
    // State to hold all onboarding data (details, domains, quiz, summary, phase)
    const [state, setState] = useState(initialOnboardingState);
    const [isLoading, setIsLoading] = useState(false);
    // Destructure user from AuthContext to check logged-in status if needed
    const { user } = useAuth(); 

    // --- Derived State (Memoized for Performance) ---

    // Calculate current progress for the progress bar
    const currentStepIndex = useMemo(() => 
        ONBOARDING_FLOW_MAP.findIndex(step => step.phase === state.currentPhase), 
        [state.currentPhase]
    );
    const totalSteps = ONBOARDING_FLOW_MAP.length;
    const currentProgress = useMemo(() => 
        Math.round((currentStepIndex + 1) / totalSteps * 100), 
        [currentStepIndex, totalSteps]
    );

    // --- State Updaters (Memoized) ---

    const nextPhase = useCallback(() => {
        // Prevent phase overflow
        if (state.currentPhase >= totalSteps) return;
        
        setState(prev => ({ 
            ...prev, 
            // Phase is 1-indexed for flow map, but can use 0-indexed for state if preferred
            currentPhase: prev.currentPhase + 1 
        }));
        // FIX: Removed showToast. Side effects belong in the hook/component.
    }, [state.currentPhase, totalSteps]);

    const prevPhase = useCallback(() => {
        // Prevent phase underflow
        if (state.currentPhase <= 1) return;
        
        setState(prev => ({ 
            ...prev, 
            currentPhase: prev.currentPhase - 1 
        }));
    }, [state.currentPhase]);

    // Generic state setter for details, domains, quiz, summary, etc.
    // Supports direct data update or functional update (data => ({...data, newProp: value}))
    const setOnboardingData = useCallback((key, data) => {
        setState(prev => ({
            ...prev,
            // Apply the update function or the direct value
            [key]: typeof data === 'function' ? data(prev[key]) : (
                // If updating an object, merge with existing data
                (typeof prev[key] === 'object' && prev[key] !== null && typeof data === 'object' && data !== null)
                    ? { ...prev[key], ...data } 
                    : data
            )
        }));
    }, []);

    // Memoize the context value to prevent unnecessary re-renders in consumers
    const contextValue = useMemo(() => ({
        onboardingState: state,
        user: user,
        isLoading,
        setIsLoading,
        currentProgress,
        nextPhase,
        prevPhase,
        setOnboardingData,
        // Destructure core state items for easier consumption
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
