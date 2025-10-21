// src/hooks/useOnboarding.js

/**
 * Custom hook wrapper for the OnboardingContext.
 * * Purpose: Provides a clean and convenient way for components 
 * to access the onboarding state and functions (like nextPhase, 
 * updateOnboardingState) without directly importing the context 
 * and useContext in every file.
 */

import { useOnboarding } from '../context/OnboardingContext'; 

// Re-exporting the hook for direct component usage
export default useOnboarding;