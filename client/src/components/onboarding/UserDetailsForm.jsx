// src/components/onboarding/UserDetailsForm.jsx

import React from 'react';
import InputField from '../ui/InputField'; // Assuming a generic InputField component
import MultiSelect from '../ui/MultiSelect'; // Assuming a generic MultiSelect component

const UserDetailsForm = ({ formData, handleChange, errors }) => {
    // Mock constants for dropdowns and multi-selects
    const educationLevels = ['High School', 'Bachelor’s', 'Master’s', 'PhD'];
    const skillOptions = ['JavaScript', 'Python', 'Figma', 'React', 'Marketing', 'SQL'];

    return (
        <div className="user-details-form-fields">
            <InputField 
                name="fullName" 
                label="Full Name" 
                value={formData.fullName} 
                onChange={handleChange} 
                error={errors.fullName}
            />
            <InputField 
                name="email" 
                label="Email" 
                value={formData.email} 
                onChange={handleChange} 
                type="email"
                error={errors.email}
            />
            
            <select name="educationLevel" value={formData.educationLevel} onChange={handleChange}>
                <option value="">Select Education Level</option>
                {educationLevels.map(level => <option key={level} value={level}>{level}</option>)}
            </select>
            
            <InputField 
                name="currentRole" 
                label="Current Role / Profession" 
                value={formData.currentRole} 
                onChange={handleChange} 
            />

            <MultiSelect 
                name="primarySkills" 
                label="Primary Skills"
                options={skillOptions}
                selected={formData.primarySkills}
                onChange={(skills) => handleChange({ target: { name: 'primarySkills', value: skills } })}
            />
        </div>
    );
};

export default UserDetailsForm;