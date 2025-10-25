import React, { useState, useCallback } from 'react';
import { Card } from '../common/Card';
import { InputField } from '../ui/InputField'; // FIX: Renamed import to InputField
import { MultiSelect } from '../ui/MultiSelect';
import { Button } from '../common/Button';
import { ArrowRight } from 'lucide-react';
import { ResumeUpload } from './ResumeUpload';

/**
 * @desc Component rendering the form for collecting user's initial details.
 * @param {object} initialDetails - The starting state from the context.
 * @param {function} onSubmit - Callback to handle the final submission of the form data.
 * @param {boolean} isLoading - Loading state passed from the hook.
 */
export const UserDetailsForm = ({ initialDetails, onSubmit, isLoading }) => {
    // Initialize local state with props, ensuring form inputs are controllable
    const [localDetails, setLocalDetails] = useState(initialDetails);
    
    // Mock data for MultiSelect options (can be centralized in constants later)
    const allSkills = ['React', 'Node.js', 'Python', 'Figma', 'AWS', 'SQL', 'TypeScript', 'Docker', 'MongoDB', 'Java', 'C++'];
    const allInterests = ['Frontend', 'Backend', 'Design', 'Data Science', 'Security', 'DevOps', 'Mobile Development'];

    const handleChange = useCallback((e) => {
        setLocalDetails(prev => ({ ...prev, [e.target.name]: e.target.value }));
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Pass the local, updated state back to the parent hook/page for validation/submission
        onSubmit(localDetails); 
    };

    const handleSkillsExtracted = useCallback((updatedDetails) => {
        // Update local state with merged skills after resume upload
        setLocalDetails(updatedDetails);
    }, []);

    return (
        <Card title="Your Background & Goals">
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Full Name */}
                <InputField
                    label="Full Name"
                    name="fullName"
                    value={localDetails.fullName}
                    onChange={handleChange}
                    required
                />
                
                {/* Education */}
                <InputField
                    label="Highest Education"
                    name="education"
                    value={localDetails.education}
                    onChange={handleChange}
                    placeholder="e.g., BSc Computer Science"
                />
                
                {/* Resume Upload (Optional, non-blocking) */}
                <ResumeUpload onSkillsExtracted={handleSkillsExtracted} />
                
                {/* Primary Skills */}
                <MultiSelect
                    label="Primary Skills (Max 15)"
                    options={allSkills}
                    selected={localDetails.skills}
                    onChange={(newSkills) => setLocalDetails({ ...localDetails, skills: newSkills })}
                    maxSelection={15}
                    placeholder="Select up to 15 relevant skills..."
                />
                
                {/* Career Interests */}
                <MultiSelect
                    label="Career Interests (Max 5)"
                    options={allInterests}
                    selected={localDetails.interests}
                    onChange={(newInterests) => setLocalDetails({ ...localDetails, interests: newInterests })}
                    maxSelection={5}
                    placeholder="Select fields you are most interested in..."
                />
                
                <Button type="submit" icon={ArrowRight} className="w-full mt-6" disabled={isLoading}>
                    {isLoading ? 'Analyzing...' : 'Continue to Domain Selection'}
                </Button>
            </form>
        </Card>
    );
};
