// src/hooks/useOnboarding.jsx (FINAL, SYNCHRONIZED VERSION)

import { useContext } from 'react';
// 🛑 CRITICAL FIX: Import the context we just built
import { OnboardingContext } from '../context/OnboardingContext'; 

/**
 * @desc Custom hook to manage the multi-step onboarding flow and expose actions.
 * This hook acts as the public interface for the OnboardingContext.
 */
export const useOnboarding = () => {
    const context = useContext(OnboardingContext);
    
    if (!context) {
        // CRITICAL: Ensure the hook is only used inside the Provider
        throw new Error('useOnboarding must be used within an OnboardingProvider');
    }

    // All state, loading, nextPhase, and API actions are exposed directly from the context.
    // This is the clean way to use contexts in React.
    return context;
};

export default useOnboarding;