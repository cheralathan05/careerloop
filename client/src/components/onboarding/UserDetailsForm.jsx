// NOTE: This component is slightly simplified as the main logic is in the hook/page
import React, { useState } from 'react';
import { Card } from '../common/Card';
import { Input } from '../common/Input';
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
    const [localDetails, setLocalDetails] = useState(initialDetails);
    
    const allSkills = ['React', 'Node.js', 'Python', 'Figma', 'AWS', 'SQL', 'TypeScript'];
    const allInterests = ['Frontend', 'Backend', 'Design', 'Data', 'Security', 'DevOps'];

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(localDetails);
    };

    const handleSkillsExtracted = (updatedDetails) => {
        // Update local state with merged skills after resume upload
        setLocalDetails(updatedDetails);
    };

    return (
        <Card title="Your Background & Goals">
            <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                    label="Full Name"
                    value={localDetails.fullName}
                    onChange={(e) => setLocalDetails({ ...localDetails, fullName: e.target.value })}
                    required
                />
                <Input
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
                    {isLoading ? 'Analyzing...' : 'Continue to Domain Selection'}
                </Button>
            </form>
        </Card>
    );
};