import React, { useCallback } from 'react';
// CRITICAL FIX: Corrected path from '../../../hooks/' to '../../hooks/'
import { useFileUpload } from '../../hooks/useFileUpload'; 
import { useOnboarding } from '../../hooks/useOnboarding'; // CRITICAL FIX: Corrected path
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { FileText, Upload, CheckCircle, XCircle } from 'lucide-react';
import { showToast } from '../../utils/toastNotifications';

/**
 * @desc Component for uploading a resume (Phase 1.5, often optional).
 * @param {function} onSkillsExtracted - Callback to notify parent (UserDetailsFormPage) of successful extraction.
 */
export const ResumeUpload = ({ onSkillsExtracted }) => {
    // Hooks provide all state and logic from fixed files
    const { state, handleFileSelect, uploadAndExtractSkills, reset } = useFileUpload();
    const { onboardingState: { details }, setOnboardingData } = useOnboarding();
    const { file, isUploading, uploadError, extractedSkills } = state;

    // Handler that runs after a successful API upload/parse
    const onSuccessCallback = useCallback((skills, fileUrl) => {
        const mergedSkills = [...new Set([...details.skills, ...skills])]; 
        
        const updatedDetails = { 
            ...details, 
            skills: mergedSkills, 
            resumeUrl: fileUrl 
        };
        
        setOnboardingData('details', updatedDetails);
        onSkillsExtracted(updatedDetails); 
        
        showToast(`Merged ${skills.length} skills from your resume!`, 'success');
    }, [details, setOnboardingData, onSkillsExtracted]);


    const handleFileUpload = async () => {
        await uploadAndExtractSkills(onSuccessCallback); 
    };

    return (
        <Card title="Upload Your Resume (Optional)" titleIcon={FileText} className="mb-6">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Upload your resume (PDF or DOCX) to automatically extract your skills. This improves AI accuracy!
            </p>

            {/* --- Drag & Drop Area --- */}
            <div 
                onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                onDrop={(e) => { e.preventDefault(); e.stopPropagation(); handleFileSelect(e.dataTransfer.files[0]); }}
                className={`border-2 border-dashed rounded-lg p-6 text-center transition duration-150 ${
                    file ? 'border-green-500 bg-green-50 dark:bg-green-900/10' : 'border-gray-300 dark:border-gray-600 hover:border-indigo-500'
                }`}
            >
                {file ? (
                    <div className="flex justify-between items-center">
                        <p className="font-medium text-sm text-gray-800 dark:text-gray-100 flex items-center">
                            <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                            File Ready: {file.name}
                        </p>
                        <Button variant="danger" size="sm" onClick={reset} icon={XCircle}>
                            Remove
                        </Button>
                    </div>
                ) : (
                    <>
                        {/* File Input (Hidden) */}
                        <input 
                            type="file" 
                            id="resume-upload" 
                            className="hidden"
                            onChange={(e) => handleFileSelect(e.target.files[0])}
                            accept=".pdf,.doc,.docx"
                        />
                        {/* Label for Click/Drag */}
                        <label htmlFor="resume-upload" className="cursor-pointer text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 flex items-center justify-center">
                            <Upload className="w-6 h-6 mr-2" />
                            Drag and drop or click here to select file
                        </label>
                    </>
                )}
            </div>

            {/* --- Status & Feedback --- */}
            {uploadError && <p className="text-red-500 text-sm mt-3">{uploadError}</p>}
            {extractedSkills.length > 0 && <p className="text-green-600 text-sm mt-3">Skills Extracted: {extractedSkills.join(', ')}</p>}

            {/* --- Upload Button --- */}
            <Button 
                onClick={handleFileUpload} 
                disabled={!file || isUploading} 
                loading={isUploading} 
                className="w-full mt-4"
                icon={Upload}
                variant="primary"
            >
                {isUploading ? 'Parsing Resume...' : 'Upload & Extract Skills'}
            </Button>
        </Card>
    );
};
