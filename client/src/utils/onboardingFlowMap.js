import { ONBOARDING_FLOW_MAP } from './constants';

/**
 * @desc Utility for managing flow state, helpful for conditional navigation.
 */

/**
 * Gets the component name for a given phase number.
 */
export const getComponentNameForPhase = (phaseNumber) => {
    const step = ONBOARDING_FLOW_MAP.find(s => s.phase === phaseNumber);
    // Transform "User Details" -> "UserDetailsForm" for component lookup
    return step ? step.name.replace(/\s/g, '') + 'Page' : 'WelcomePage';
};

/**
 * Checks if a phase is beyond the current state (prevents jumping forward).
 */
export const isPhaseLocked = (targetPhase, currentPhase) => {
    return targetPhase > currentPhase;
};