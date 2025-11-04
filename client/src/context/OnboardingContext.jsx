// src/context/OnboardingContext.jsx (FINAL, FUNCTIONAL VERSION)

import React, { createContext, useState, useMemo, useCallback, useEffect } from 'react';
import useAuth from '../hooks/useAuth';
import { initialOnboardingState, ONBOARDING_FLOW_MAP } from '../utils/constants'; 
import { showToast } from '../utils/toastNotifications'; // Use toast utility
import axiosInstance from '../utils/axiosInstance.js'; // Use secure API instance

// Define the Onboarding Context
export const OnboardingContext = createContext(null);

// --- 🎯 Onboarding Actions Hook (API Logic) ---
// This separates the heavy API business logic from the state management
const useOnboardingActions = (state, setState, setIsLoading, user, nextPhase, setOnboardingData) => {
    
    // Base URL for all onboarding endpoints
    const API_URL = '/onboarding'; 

    // 1. Save User Details (Phase 9)
    const saveUserDetails = useCallback(async (detailsData) => {
        if (!user) return showToast('Authentication required.', 'error');
        setIsLoading(true);
        try {
            // 1. Save to backend (triggers background AI prefetch)
            const response = await axiosInstance.post(`${API_URL}/details`, detailsData);
            
            // 2. Update local state
            setOnboardingData('details', detailsData);
            
            showToast('Details saved. Preparing recommendations...', 'success');
            nextPhase();
            return response.data;
        } catch (error) {
            showToast(error.response?.data?.message || 'Failed to save details.', 'error');
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, [user, setIsLoading, nextPhase, setOnboardingData]);

    // 2. Get Recommended Domains (Phase 9)
    const getRecommendedDomains = useCallback(async () => {
        if (!user) return showToast('Authentication required.', 'error');
        setIsLoading(true);
        try {
            const response = await axiosInstance.get(`${API_URL}/domains`);
            
            // Update local state with domains
            setOnboardingData('domains', response.data); 
            
            return response.data;
        } catch (error) {
            showToast(error.response?.data?.message || 'Failed to load domains.', 'error');
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, [user, setIsLoading, setOnboardingData]);

    // 3. Select Domains & Get Quiz (Phase 10)
    const selectDomainsAndGetQuiz = useCallback(async (selectedDomains) => {
        if (!user) return showToast('Authentication required.', 'error');
        setIsLoading(true);
        try {
            // Send selected domains to backend to trigger quiz generation
            const response = await axiosInstance.post(`${API_URL}/quiz`, { selectedDomains });
            
            // Update local state with the newly generated quiz questions
            setOnboardingData('quiz', response.data);
            setOnboardingData('domains', selectedDomains); // Finalize selected domains
            
            showToast('Quiz generated. Starting assessment...', 'success');
            nextPhase();
            return response.data;
        } catch (error) {
            showToast(error.response?.data?.message || 'Failed to generate assessment.', 'error');
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, [user, setIsLoading, nextPhase, setOnboardingData]);

    // 4. Submit Assessment (Phase 11)
    const submitAssessment = useCallback(async (answers) => {
        if (!user) return showToast('Authentication required.', 'error');
        setIsLoading(true);
        try {
            // Send answers to backend for grading and cache saving
            const response = await axiosInstance.post(`${API_URL}/assessment`, { answers });
            
            // The response contains score metrics; update scores and move phase
            setOnboardingData('skillScores', response.data.scoreMetrics);
            setOnboardingData('answers', answers);
            
            showToast('Assessment submitted. Generating summary...', 'success');
            nextPhase();
            return response.data;
        } catch (error) {
            showToast(error.response?.data?.message || 'Failed to submit assessment.', 'error');
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, [user, setIsLoading, nextPhase, setOnboardingData]);

    // 5. Get Summary Report (Phase 12)
    const getSummaryReport = useCallback(async () => {
        if (!user) return showToast('Authentication required.', 'error');
        setIsLoading(true);
        try {
            const response = await axiosInstance.get(`${API_URL}/summary`);
            
            // Update local state with the final summary
            setOnboardingData('summary', response.data);
            
            return response.data;
        } catch (error) {
            showToast(error.response?.data?.message || 'Failed to generate summary.', 'error');
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, [user, setIsLoading, setOnboardingData]);
    
    // 6. Complete Onboarding (Phase 14)
    const completeOnboarding = useCallback(async () => {
        if (!user) return showToast('Authentication required.', 'error');
        setIsLoading(true);
        try {
            const response = await axiosInstance.post(`${API_URL}/complete`);
            
            // CRITICAL: Update AuthContext state immediately after successful completion
            setState(prev => ({ ...prev, isComplete: true }));
            
            showToast('Onboarding complete! Welcome to CareerLoop.', 'success');
            // NOTE: The component using this should trigger the Navigate to /dashboard
            return response.data;
        } catch (error) {
            showToast(error.response?.data?.message || 'Failed to complete onboarding.', 'error');
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, [user, setIsLoading]);

    // Return the bundle of actions
    return {
        saveUserDetails,
        getRecommendedDomains,
        selectDomainsAndGetQuiz,
        submitAssessment,
        getSummaryReport,
        completeOnboarding
    };
};

// Provider Component
export const OnboardingProvider = ({ children }) => {
    const [state, setState] = useState(initialOnboardingState);
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useAuth();

    // --- State Updaters (Memoized) ---
    const totalSteps = ONBOARDING_FLOW_MAP.length;

    const nextPhase = useCallback(() => {
        if (state.currentPhase >= totalSteps) return;
        setState(prev => ({ ...prev, currentPhase: prev.currentPhase + 1 }));
    }, [state.currentPhase, totalSteps]);

    const prevPhase = useCallback(() => {
        if (state.currentPhase <= 1) return;
        setState(prev => ({ ...prev, currentPhase: prev.currentPhase - 1 }));
    }, [state.currentPhase]);

    const setOnboardingData = useCallback((key, data) => {
        setState(prev => ({
            ...prev,
            // Generic merging logic for object keys (like 'details')
            [key]: (typeof prev[key] === 'object' && prev[key] !== null && typeof data === 'object' && data !== null)
                ? { ...prev[key], ...data } 
                : data
        }));
    }, []);
    
    // --- Phase 0: Check if user is already complete (runs once) ---
    // Should align with the user object check in AuthContext/useAuth
    useEffect(() => {
        if (user && user.onboardingComplete && !state.isComplete) {
             setState(prev => ({ ...prev, isComplete: true }));
        }
    }, [user, state.isComplete]);


    // --- Derived State & Actions Hook ---
    const actions = useOnboardingActions(state, setState, setIsLoading, user, nextPhase, setOnboardingData);

    const contextValue = useMemo(() => ({
        onboardingState: state,
        user: user,
        isLoading,
        // Memoized calculated properties
        currentProgress: Math.round((ONBOARDING_FLOW_MAP.findIndex(step => step.phase === state.currentPhase) + 1) / totalSteps * 100),
        
        // Export state setters and API actions
        nextPhase,
        prevPhase,
        setOnboardingData,
        ...actions, // Export all API interaction functions
    }), [state, user, isLoading, nextPhase, prevPhase, setOnboardingData, actions, totalSteps]);

    return (
        <OnboardingContext.Provider value={contextValue}>
            {children}
        </OnboardingContext.Provider>
    );
};