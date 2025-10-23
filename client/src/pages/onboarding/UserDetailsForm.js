import React, { useState } from 'react';
import { useOnboarding } from '../../../hooks/useOnboarding';
import { OnboardingLayout } from '../../../components/layout/OnboardingLayout';
import { InputField } from '../../../components/ui/InputField';
import { MultiSelect } from '../../../components/ui/MultiSelect';
import { Button } from '../../../components/common/Button';
import { ResumeUpload } from '../../../components/onboarding/ResumeUpload';
import { AILoader } from '../../../components/loaders/AILoader';
import { ArrowRight } from 'lucide-react';
import { AlertBox } from '../../../components/ui/AlertBox';

/**
 * @desc Phase 2: Collects user's current skills, interests, and background.
 */
const UserDetailsFormPage = () => {
    const { 
        onboardingState: { details }, 
        handleDetailsSubmission, 
        isLoading,
        onboardingError
    } = useOnboarding();

    // Use local state to manage form changes before submission
    const [localDetails, setLocalDetails] = useState(details);
    
    // Mock data for MultiSelect options
    const allSkills = ['React', 'Node.js', 'Python', 'Figma', 'AWS', 'SQL', 'TypeScript', 'MongoDB'];
    const allInterests = ['Frontend', 'Backend', 'Design', 'Data', 'Security', 'DevOps'];

    const handleSubmit = (e) => {
        e.preventDefault();
        if (localDetails.skills.length === 0) {
            alert('Please add at least one skill or upload your resume.');
            return;
        }
        handleDetailsSubmission(localDetails);
    };
    
    const handleSkillsExtracted = (updatedDetails) => {
        // Update local state with merged skills after resume upload
        setLocalDetails(updatedDetails);
    };


    if (isLoading) return <OnboardingLayout title="Gathering Data"><AILoader text="Saving details and analyzing profile..." /></OnboardingLayout>;

    return (
        <OnboardingLayout title="Tell Us About You">
            {onboardingError && <AlertBox type="error" message={onboardingError} className="mb-4"/>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <InputField
                    label="Full Name"
                    value={localDetails.fullName}
                    onChange={(e) => setLocalDetails({ ...localDetails, fullName: e.target.value })}
                    required
                />
                <InputField
                    label="Highest Education"
                    value={localDetails.education}
                    onChange={(e) => setLocalDetails({ ...localDetails, education: e.target.value })}
                    placeholder="e.g., BSc Computer Science"
                />
                
                {/* Resume Upload (Optional, non-blocking) */}
                <ResumeUpload onSkillsExtracted={handleSkillsExtracted} />
                
                <MultiSelect
                    label="Primary Skills"
                    options={allSkills}
                    selected={localDetails.skills}
                    onChange={(newSkills) => setLocalDetails({ ...localDetails, skills: newSkills })}
                    maxSelection={15}
                />
                
                <MultiSelect
                    label="Career Interests"
                    options={allInterests}
                    selected={localDetails.interests}
                    onChange={(newInterests) => setLocalDetails({ ...localDetails, interests: newInterests })}
                    maxSelection={5}
                />
                
                <Button type="submit" icon={ArrowRight} className="w-full mt-6" disabled={isLoading}>
                    Continue to Domain Selection
                </Button>
            </form>
        </OnboardingLayout>
    );
};

export default UserDetailsFormPage;