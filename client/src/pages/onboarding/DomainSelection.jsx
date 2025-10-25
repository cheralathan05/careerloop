import React, { useState, useEffect, useCallback } from 'react'; // Added useCallback
import { useOnboarding } from '../../hooks/useOnboarding'; // Fixed in step 19
import { OnboardingLayout } from '../../components/layout/OnboardingLayout';
import { Button } from '../../components/common/Button';
import { DomainCard } from '../../components/onboarding/DomainCard'; 
import { AILoader } from '../../components/loaders/AILoader';
import { ArrowRight } from 'lucide-react';
import { AlertBox } from '../../components/ui/AlertBox';
import { showToast } from '../../utils/toastNotifications'; // Import fixed utility

/**
 * @desc Phase 3: User selects desired career domains based on AI recommendations.
 */
const DomainSelectionPage = () => {
    const { 
        onboardingState: { domains }, 
        handleDomainSelection, 
        isLoading,
        onboardingError,
        // Assuming MAX_DOMAINS_SELECT is available via a constant/context
    } = useOnboarding();
    
    // State to track user selections by domain name
    const [selectedDomainNames, setSelectedDomainNames] = useState([]);
    const MAX_SELECTION = 5; // Define max selection locally or import from constants

    // Auto-select top 3 on initial load
    useEffect(() => {
        if (domains.length > 0 && selectedDomainNames.length === 0) {
            // Sort domains by score just in case, then select top 3
            const initialSelection = [...domains]
                .sort((a, b) => (b.score || 0) - (a.score || 0)) // Sort by score DESC
                .slice(0, 3)
                .map(d => d.name);
            setSelectedDomainNames(initialSelection);
        }
    }, [domains, selectedDomainNames.length]);

    const handleSelectDomain = useCallback((domainName) => {
        setSelectedDomainNames(prev => {
            if (prev.includes(domainName)) {
                // Remove domain
                return prev.filter(d => d !== domainName); 
            } else if (prev.length < MAX_SELECTION) {
                // Add domain, respecting max limit
                return [...prev, domainName];
            } else {
                // Show toast if max reached
                showToast(`You can only select up to ${MAX_SELECTION} domains.`, 'warning');
                return prev;
            }
        });
    }, [MAX_SELECTION]);

    const handleSubmit = () => {
        if (selectedDomainNames.length === 0) {
            const message = "Please select at least one domain to proceed.";
            // ENHANCEMENT: Use fixed showToast instead of browser alert
            showToast(message, 'warning'); 
            return;
        }
        
        // Filter the full domain objects based on selected names
        const finalSelection = domains.filter(d => selectedDomainNames.includes(d.name));
        
        // Call the hook function, which will save selection and fetch the quiz
        handleDomainSelection(finalSelection); 
    };

    // --- Loading and Error States ---

    if (isLoading) return (
        <OnboardingLayout title="Analyzing Domains">
            {/* The loading text reflects the next action: generating the quiz */}
            <AILoader text="Generating personalized quiz based on your choices..." />
        </OnboardingLayout>
    );
    
    // --- Main Render ---
    
    return (
        <OnboardingLayout title="Choose Your Path">
            {onboardingError && <AlertBox type="error" message={onboardingError} className="mb-4"/>}
            <p className="text-gray-600 dark:text-gray-400 mb-6">
                Select **1 to {MAX_SELECTION}** paths you wish to pursue for your skill assessment.
                <span className="font-medium text-indigo-600 dark:text-indigo-400 block mt-1">
                    ({selectedDomainNames.length} currently selected)
                </span>
            </p>

            <div className="grid md:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto pr-2">
                {domains.length === 0 ? (
                    <AlertBox type="warning" message="No domains were found based on your profile. Please check your submitted details." />
                ) : (
                    domains.map((domain, index) => (
                        <DomainCard
                            key={index}
                            domain={domain.name}
                            score={domain.score}
                            onSelect={() => handleSelectDomain(domain.name)}
                            isSelected={selectedDomainNames.includes(domain.name)}
                        />
                    ))
                )}
            </div>

            <Button 
                onClick={handleSubmit} 
                disabled={selectedDomainNames.length === 0} 
                icon={ArrowRight} 
                className="w-full mt-6"
                variant={selectedDomainNames.length > 0 ? 'primary' : 'secondary'}
            >
                Start Skill Assessment ({selectedDomainNames.length} selected)
            </Button>
        </OnboardingLayout>
    );
};

export default DomainSelectionPage;
