import React, { useState, useEffect } from 'react';
import { useOnboarding } from '../../hooks/useOnboarding';

import { OnboardingLayout } from '../../components/layout/OnboardingLayout';
import { Button } from '../../components/common/Button';
import { DomainCard } from '../../components/onboarding/DomainCard'; 
import { AILoader } from '../../components/loaders/AILoader';
import { ArrowRight } from 'lucide-react';
import { AlertBox } from '../../components/ui/AlertBox';

/**
 * @desc Phase 3: User selects desired career domains based on AI recommendations.
 */
const DomainSelectionPage = () => {
    const { 
        onboardingState: { domains }, 
        handleDomainSelection, 
        isLoading,
        onboardingError
    } = useOnboarding();
    
    // State to track user selections by domain name
    const [selectedDomainNames, setSelectedDomainNames] = useState([]);
    
    // Auto-select top 3 on initial load
    useEffect(() => {
        if (domains.length > 0 && selectedDomainNames.length === 0) {
            setSelectedDomainNames(domains.slice(0, 3).map(d => d.name));
        }
    }, [domains, selectedDomainNames.length]);

    const handleSelectDomain = (domainName) => {
        setSelectedDomainNames(prev => 
            prev.includes(domainName) 
                ? prev.filter(d => d !== domainName) 
                : [...prev, domainName].slice(0, 5) // Limit to 5 selections
        );
    };

    const handleSubmit = () => {
        if (selectedDomainNames.length === 0) {
            alert("Please select at least one domain.");
            return;
        }
        const finalSelection = domains.filter(d => selectedDomainNames.includes(d.name));
        handleDomainSelection(finalSelection); 
    };

    if (isLoading) return (
        <OnboardingLayout title="Analyzing Domains">
            <AILoader text="Generating personalized quiz based on your choices..." />
        </OnboardingLayout>
    );
    
    return (
        <OnboardingLayout title="Choose Your Path">
            {onboardingError && <AlertBox type="error" message={onboardingError} className="mb-4"/>}
            <p className="text-gray-600 dark:text-gray-400 mb-6">
                Select 1 to 5 paths you wish to pursue for your skill assessment.
            </p>

            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                {domains.length === 0 ? (
                    <AlertBox type="warning" message="No domains found. Please ensure skills were entered." />
                ) : (
                    domains.map((domain, index) => (
                        <DomainCard
                            key={index}
                            domain={domain.name}
                            score={domain.score}
                            onSelect={handleSelectDomain}
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
            >
                Start Skill Assessment ({selectedDomainNames.length} selected)
            </Button>
        </OnboardingLayout>
    );
};

export default DomainSelectionPage;
