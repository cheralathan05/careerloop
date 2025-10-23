import React, { useState, useEffect, useCallback } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Input } from '../common/Input'; // Assuming your generic Input handles text and textarea
import { MultiSelect } from '../ui/MultiSelect'; // Assuming you use the enhanced MultiSelect component
import { useOnboarding } from '../../hooks/useOnboarding';
import { saveUserDetails } from '../../services/onboardingService';
import { showToast } from '../../utils/toastNotifications';
import { MAX_DOMAINS_SELECT } from '../../utils/constants'; // Reusing constant for max skills

/**
 * @desc Modal for editing the user's initial details (skills, education, interests).
 */
export const EditDetailsModal = ({ isOpen, onClose }) => {
    const { details, setOnboardingData, isLoading, setIsLoading } = useOnboarding();
    const [localDetails, setLocalDetails] = useState(details);
    const [error, setError] = useState(null);
    
    // Sync local state with global context state whenever the modal opens
    useEffect(() => {
        setLocalDetails(details);
        setError(null);
    }, [isOpen, details]);

    // Mock options for demonstration
    const availableSkills = ['React', 'Node.js', 'Python', 'AWS', 'SQL', 'Figma', 'TypeScript', 'MongoDB', 'Django'];

    const handleSave = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        // Simple validation check
        if (!localDetails.fullName || localDetails.skills.length === 0) {
            setError("Full name and at least one skill are required.");
            setIsLoading(false);
            return;
        }

        try {
            // 1. Call service to update details on the server (POST /api/onboarding/save)
            // This re-runs the initial step, saving the new details to Redis cache.
            await saveUserDetails(localDetails); 
            
            // 2. Update the context state permanently
            setOnboardingData('details', localDetails);
            
            showToast('Profile details updated successfully!', 'success');
            onClose();

        } catch (err) {
            setError(err.message || 'Failed to save changes. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }, [localDetails, setIsLoading, setOnboardingData, onClose]);


    const handleSkillToggle = useCallback((skill) => {
        const newSkills = localDetails.skills.includes(skill)
            ? localDetails.skills.filter(s => s !== skill)
            : [...localDetails.skills, skill];
        
        setLocalDetails(prev => ({ ...prev, skills: newSkills }));
    }, [localDetails]);

    return (
        <Modal 
            isOpen={isOpen} 
            onClose={onClose} 
            title="Edit User Profile"
            size="lg"
        >
            <div className="space-y-4">
                {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
                
                <Input 
                    label="Full Name"
                    value={localDetails.fullName || ''}
                    onChange={(e) => setLocalDetails(prev => ({ ...prev, fullName: e.target.value }))}
                    required
                />
                <Input 
                    label="Highest Education"
                    value={localDetails.education || ''}
                    onChange={(e) => setLocalDetails(prev => ({ ...prev, education: e.target.value }))}
                />
                
                <MultiSelect
                    label={`Skills (Up to ${MAX_DOMAINS_SELECT} selected)`}
                    options={availableSkills}
                    selected={localDetails.skills}
                    onChange={(newSkills) => setLocalDetails(prev => ({ ...prev, skills: newSkills }))}
                    maxSelection={MAX_DOMAINS_SELECT}
                />

                <Input 
                    label="Interests (Comma separated)"
                    value={localDetails.interests.join(', ') || ''}
                    onChange={(e) => setLocalDetails(prev => ({ 
                        ...prev, 
                        interests: e.target.value.split(',').map(s => s.trim()).filter(s => s) 
                    }))}
                    placeholder="e.g., AI, Cybersecurity, Leadership"
                />
                
                <div className="pt-4 flex justify-end space-x-3">
                    <Button onClick={onClose} variant="secondary">Cancel</Button>
                    <Button onClick={handleSave} loading={isLoading} disabled={isLoading} variant="primary">
                        Save Changes
                    </Button>
                </div>
            </div>
        </Modal>
    );
};