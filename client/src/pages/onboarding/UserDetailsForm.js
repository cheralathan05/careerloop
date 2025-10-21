// src/pages/onboarding/UserDetailsForm.js

import React, { useState } from 'react';
import useOnboarding from '../../hooks/useOnboarding';
import useFileUpload from '../../hooks/useFileUpload'; 
import OnboardingLayout from '../../components/layout/OnboardingLayout';
import UserDetailsFormComponent from '../../components/onboarding/UserDetailsForm'; // Assume this handles UI fields
import ResumeUpload from '../../components/onboarding/ResumeUpload';
import Button from '../../components/ui/Button';
import { validateUserDetails } from '../../utils/formValidation';

const UserDetailsForm = () => {
    const { state, nextPhase } = useOnboarding();
    const [formData, setFormData] = useState(state.userData);
    const [errors, setErrors] = useState({});
    
    // Resume handling hook (uses uploadService under the hood)
    const { file, isUploading, handleFileChange, uploadProgress } = useFileUpload(); 

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleNext = async () => {
        const validationErrors = validateUserDetails(formData);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            // NOTE: toastNotifications.error("Please fix the errors.") would be used here.
            return;
        }

        // 1. Optional: Process Resume Upload if a file is present
        if (file) {
            // Assume upload hook handles the service call to parse the file
            // The file processing may automatically update formData.primarySkills
            console.log("Uploading and parsing resume...");
        }

        // 2. System Action: Store data and move to the next phase (7)
        // Pass the updated data object to nextPhase, which merges it into context.
        nextPhase(formData); 
    };

    return (
        <OnboardingLayout>
            <div className="details-form-page">
                <h2>Phase 6: Tell Us About Yourself</h2>
                <p>This information helps our AI personalize your career trajectory.</p>
                
                {/* Main Form Component */}
                <UserDetailsFormComponent formData={formData} handleChange={handleChange} errors={errors} />

                {/* Optional Resume Upload */}
                <ResumeUpload 
                    onFileChange={handleFileChange} 
                    isUploading={isUploading} 
                    progress={uploadProgress} 
                />

                <Button onClick={handleNext} variant="primary" disabled={isUploading}>
                    Next: Domain Selection (7)
                </Button>
            </div>
        </OnboardingLayout>
    );
};

export default UserDetailsForm;