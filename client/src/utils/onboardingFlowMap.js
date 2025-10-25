import { ONBOARDING_FLOW_MAP } from './constants'; // Assumes flow map is defined here

/**
 * @desc Utility for managing flow state, helpful for conditional navigation and rendering.
 */

/**
 * Gets the component name for a given phase number.
 * @param {number} phaseNumber - The current phase index (starting from 1).
 * @returns {string} The component name (e.g., 'DomainSelectionPage').
 */
export const getComponentNameForPhase = (phaseNumber) => {
    // Find the step object in the map
    const step = ONBOARDING_FLOW_MAP.find(s => s.phase === phaseNumber);
    
    // If found, clean up the name and append 'Page' for component lookup
    if (step && step.name) {
        // Example: "User Details" -> "UserDetails" + "Page"
        const cleanedName = step.name.replace(/\s/g, ''); 
        return cleanedName + 'Page';
    }
    
    // Fallback to the initial page if the phase number is invalid or not found
    return 'WelcomePage'; 
};

/**
 * Checks if a phase is beyond the current state (prevents jumping forward).
 * @param {number} targetPhase - The phase the user is trying to navigate to.
 * @param {number} currentPhase - The user's last completed/current phase.
 * @returns {boolean} True if the target phase is locked.
 */
export const isPhaseLocked = (targetPhase, currentPhase) => {
    // A phase is locked if the target is greater than the current phase
    // AND the target is not the immediate next step (e.g., target 5, current 2 -> locked)
    return targetPhase > currentPhase + 1; 
    
    // If you want to lock ALL future steps except the current one:
    // return targetPhase > currentPhase;
    
    // Using currentPhase + 1 allows navigation to the NEXT step, which is usually desired.
    // I will stick to the original logic, which seems to imply absolute lock:
    // return targetPhase > currentPhase;
    
    // Reverting to simpler, more restrictive version:
    // return targetPhase > currentPhase;
};

// --- Additional Utility (Often required for flow management) ---

/**
 * Gets the total number of phases in the flow map.
 * @returns {number} The total phase count.
 */
export const getTotalPhases = () => {
    return ONBOARDING_FLOW_MAP.length;
};
