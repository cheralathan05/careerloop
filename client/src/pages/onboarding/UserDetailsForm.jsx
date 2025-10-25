import React, { useState, useCallback } from 'react'; // Added useCallback
import { useOnboarding } from '../../hooks/useOnboarding'; // Fixed in step 19
import { OnboardingLayout } from '../../components/layout/OnboardingLayout';
import { InputField } from '../../components/ui/InputField';
import { MultiSelect } from '../../components/ui/MultiSelect';
import { Button } from '../../components/common/Button';
import { ResumeUpload } from '../../components/onboarding/ResumeUpload';
import { AILoader } from '../../components/loaders/AILoader';
import { ArrowRight } from 'lucide-react';
import { AlertBox } from '../../components/ui/AlertBox';
import { showToast } from '../../utils/toastNotifications'; // Import fixed utility

/**
 * @desc Phase 2: Collects user's current skills, interests, and background.
 */
const UserDetailsFormPage = () => {
    const { 
        onboardingState: { details }, 
        handleDetailsSubmission, 
        isLoading,
        onboardingError // Local error state from hook
    } = useOnboarding();

    // Initialize local state with data from the context (details)
    const [localDetails, setLocalDetails] = useState(details);
    const [validationError, setValidationError] = useState(null);

    // Centralized handler for all simple field changes
    const handleChange = useCallback((e) => {
        setLocalDetails(prev => ({ ...prev, [e.target.name]: e.target.value }));
    }, []);

    // Handler for MultiSelect components
    const handleMultiSelectChange = useCallback((key, newValues) => {
        setLocalDetails(prev => ({ ...prev, [key]: newValues }));
        setValidationError(null); // Clear validation on user input
    }, []);

    // Handler to merge skills extracted from the ResumeUpload component
    const handleSkillsExtracted = useCallback((extractedData) => {
        setLocalDetails(prev => ({
            ...prev,
            // Merge existing skills with extracted skills and ensure no duplicates
            skills: Array.from(new Set([...prev.skills, ...extractedData.extractedSkills])),
            resumeUrl: extractedData.fileUrl,
        }));
        showToast('Skills extracted successfully! Review and continue.', 'success');
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        setValidationError(null);

        // --- Client-Side Validation ---
        if (!localDetails.fullName.trim()) {
            setValidationError('Please enter your full name.');
            showToast('Full Name is required.', 'warning');
            return;
        }
        if (localDetails.skills.length === 0) {
            setValidationError('Please add at least one primary skill (or upload your resume).');
            showToast('At least one skill is required.', 'warning');
            return;
        }
        
        // --- Submit to Hook (which calls the service) ---
        handleDetailsSubmission(localDetails);
    };

    if (isLoading) return (
        <OnboardingLayout title="Gathering Data">
            <AILoader text="Saving details and generating domain recommendations..." />
        </OnboardingLayout>
    );

    return (
        <OnboardingLayout title="Tell Us About You">
            {/* Display error from hook (API error) or local validation */}
            {(onboardingError || validationError) && (
                <AlertBox 
                    type="error" 
                    message={onboardingError || validationError} 
                    className="mb-4" 
                />
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
                <InputField
                    label="Full Name"
                    name="fullName"
                    value={localDetails.fullName}
                    onChange={handleChange}
                    required
                />
                <InputField
                    label="Highest Education"
                    name="education"
                    value={localDetails.education}
                    onChange={handleChange}
                    placeholder="e.g., BSc Computer Science"
                />
                
                {/* Resume Upload Component */}
                <ResumeUpload onSkillsExtracted={handleSkillsExtracted} />
                
                <MultiSelect
                    label="Primary Skills (Max 15)"
                    options={allSkills} // Using mock data
                    selected={localDetails.skills}
                    onChange={(newSkills) => handleMultiSelectChange('skills', newSkills)}
                    maxSelection={15}
                    placeholder="Start typing or select from suggested skills..."
                />
                
                <MultiSelect
                    label="Career Interests (Max 5)"
                    options={allInterests} // Using mock data
                    selected={localDetails.interests}
                    onChange={(newInterests) => handleMultiSelectChange('interests', newInterests)}
                    maxSelection={5}
                    placeholder="Select fields you are curious about..."
                />
                
                <Button 
                    type="submit" 
                    icon={ArrowRight} 
                    className="w-full mt-6" 
                    disabled={isLoading}
                    variant="primary"
                >
                    Continue to Domain Selection
                </Button>
            </form>
        </OnboardingLayout>
    );
};

export default UserDetailsFormPage;

