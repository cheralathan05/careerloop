// src/context/OnboardingContext.jsx

import React, { createContext, useState, useContext } from 'react';
import { onboardingFlowMap } from '../utils/onboardingFlowMap';
import { useOnboarding } from '../context/OnboardingContext';
// 1. Create Context
const OnboardingContext = createContext();

// Initial State Structure
const initialOnboardingState = {
    phase: 5, // Start at Welcome Screen
    userData: {
        fullName: '',
        email: '',
        educationLevel: '',
        currentRole: '',
        interests: [],
        primarySkills: [],
        selectedDomains: [],
    },
    skillAssessmentScores: null,
    aiRecommendations: null,
};

// 2. Context Provider Component
export const OnboardingProvider = ({ children }) => {
    const [state, setState] = useState(initialOnboardingState);

    // Function to handle moving to the next phase
    const nextPhase = (data = {}) => {
        const nextPhaseNumber = onboardingFlowMap[state.phase]?.next;
        if (nextPhaseNumber) {
            setState(prevState => ({
                ...prevState,
                phase: nextPhaseNumber,
                userData: { ...prevState.userData, ...data }, // Merge new data
            }));
            // NOTE: In a real app, you'd call useAnalytics.trackPhase(nextPhaseNumber) here
            console.log(`Transitioning from Phase ${state.phase} to Phase ${nextPhaseNumber}`);
        } else {
            console.warn(`No next phase defined for ${state.phase}. Onboarding complete.`);
        }
    };

    // Function to update state across phases
    const updateOnboardingState = (updates) => {
        setState(prevState => ({
            ...prevState,
            ...updates,
            userData: { ...prevState.userData, ...(updates.userData || {}) }
        }));
    };

    return (
        <OnboardingContext.Provider value={{ state, nextPhase, updateOnboardingState, initialOnboardingState }}>
            {children}
        </OnboardingContext.Provider>
    );
};

// 3. Custom Hook
export const useOnboarding = () => useContext(OnboardingContext);