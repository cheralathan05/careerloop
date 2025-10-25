import React from 'react';
import { Loader } from '../common/Loader'; // Assuming correct import from fixed components

/**
 * @desc Generic loader for onboarding pages or steps.
 * Shows a message while initial data is being fetched or during transitions.
 * @param {string} message - Optional text to display below the loader.
 * @param {string} className - Optional additional Tailwind classes for customization.
 */
export const OnboardingLoader = ({
    message = 'Loading onboarding data...',
    className = ''
}) => {
    return (
        <div
            className={`flex flex-col items-center justify-center h-64 w-full ${className}`}
            role="status"
            aria-live="polite"
        >
            {/* Central spinner or animation. We pass the message down to the central Loader */}
            <Loader size="lg" message={message} />
        </div>
    );
};