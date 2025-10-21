// src/pages/onboarding/DomainSelection.js

import React, { useState, useEffect } from 'react';
import useOnboarding from '../../hooks/useOnboarding';
import OnboardingLayout from '../../components/layout/OnboardingLayout';
import Button from '../../components/ui/Button';
import DomainCard from '../../components/onboarding/DomainCard';
import OnboardingLoader from '../../components/loaders/OnboardingLoader';
import onboardingService from '../../services/onboardingService'; // Assume this fetches domain recommendations

const DomainSelection = () => {
    const { state, nextPhase, updateOnboardingState } = useOnboarding();
    const [recommendedDomains, setRecommendedDomains] = useState([]);
    const [selectedDomains, setSelectedDomains] = useState(state.userData.selectedDomains || []);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // AI Interaction: Fetch domains based on skills entered in Phase 6
        const fetchDomains = async () => {
            setIsLoading(true);
            try {
                // Mock API call using user's primary skills
                const recommended = await onboardingService.getDomainRecommendations(state.userData.primarySkills);
                setRecommendedDomains(recommended);
            } catch (error) {
                console.error("Error fetching domains:", error);
                // Fallback to a default list if service fails
                setRecommendedDomains([
                    { id: 'web_dev', name: 'Web Development', skills: ['JavaScript', 'React', 'Node.js'] },
                    { id: 'data_science', name: 'Data Science', skills: ['Python', 'SQL', 'Machine Learning'] },
                    { id: 'ux_ui', name: 'UX/UI Design', skills: ['Figma', 'Prototyping', 'User Research'] },
                ]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDomains();
    }, [state.userData.primarySkills]);

    const handleSelectDomain = (domainId) => {
        setSelectedDomains(prev => {
            if (prev.includes(domainId)) {
                return prev.filter(id => id !== domainId);
            }
            if (prev.length < 3) { // Limit to 3 domains
                return [...prev, domainId];
            }
            return prev;
        });
    };

    const handleNext = () => {
        if (selectedDomains.length === 0) {
            alert("Please select at least one domain to continue.");
            return;
        }

        // System Action: Save selected domains and update assessment for next phase (8)
        updateOnboardingState({ 
            userData: { selectedDomains } 
        });
        
        // This implicitly triggers the logic in SkillAssessment.js to fetch relevant questions.
        nextPhase();
    };

    if (isLoading) {
        return <OnboardingLayout><OnboardingLoader message="Analyzing skills for domain recommendations..." /></OnboardingLayout>;
    }

    return (
        <OnboardingLayout>
            <div className="domain-selection-page">
                <h2>Phase 7: Choose Your Career Domains</h2>
                <p>Based on your skills, the AI recommends these paths. Select 1 to 3 to assess your specific proficiency.</p>
                <div className="domain-cards-grid">
                    {recommendedDomains.map(domain => (
                        <DomainCard
                            key={domain.id}
                            domain={domain}
                            isSelected={selectedDomains.includes(domain.id)}
                            onSelect={handleSelectDomain}
                        />
                    ))}
                </div>
                <div className="action-footer">
                    <p>Selected: {selectedDomains.length} / 3</p>
                    <Button 
                        onClick={handleNext} 
                        variant="primary" 
                        disabled={selectedDomains.length === 0}
                    >
                        Next: Start Skill Assessment (8)
                    </Button>
                </div>
            </div>
        </OnboardingLayout>
    );
};

export default DomainSelection;