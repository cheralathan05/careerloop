import React from 'react';
import { Loader } from '../common/Loader'; // Assuming Loader is imported from common

/**
 * @desc Generic loader for the entire onboarding section while initial data is being fetched,
 * or during general page transitions.
 */
export const OnboardingLoader = ({ message = 'Loading onboarding data...', className = '' }) => {
    return (
        <div className={`flex items-center justify-center h-64 w-full ${className}`}>
            {/* Reuses the standard Loader component */}
            <Loader size="lg" message={message} />
        </div>
    );
};