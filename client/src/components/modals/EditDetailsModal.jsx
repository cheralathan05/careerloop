// src/components/modals/EditDetailsModal.jsx

import React, { useState } from 'react';
import Button from '../ui/Button';
import UserDetailsFormComponent from '../onboarding/UserDetailsForm'; 
import useOnboarding from '../../hooks/useOnboarding';

const EditDetailsModal = ({ isOpen, onClose }) => {
    const { state, updateOnboardingState } = useOnboarding();
    const [editData, setEditData] = useState(state.userData);

    if (!isOpen) return null;
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        updateOnboardingState({ userData: editData });
        alert("Details updated successfully!");
        onClose();
    };

    return (
        <div className="modal-backdrop">
            <div className="modal-content">
                <h3>Edit User Details</h3>
                <UserDetailsFormComponent formData={editData} handleChange={handleChange} errors={{}} />
                <div className="modal-actions">
                    <Button onClick={handleSave} variant="primary">Save Changes</Button>
                    <Button onClick={onClose} variant="default">Cancel</Button>
                </div>
            </div>
        </div>
    );
};

export default EditDetailsModal;