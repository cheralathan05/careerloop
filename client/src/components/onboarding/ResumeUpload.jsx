// src/components/onboarding/ResumeUpload.jsx

import React from 'react';
import ProgressRing from '../ui/ProgressRing'; // Re-use UI component
import Card from '../ui/Card';

const ResumeUpload = ({ onFileChange, isUploading, progress }) => {
    return (
        <Card title="Optional: Resume Upload" className="resume-upload-card">
            <p className="upload-tip">Upload your resume (PDF) to auto-fill skills and save time!</p>
            <div className="upload-area">
                <input 
                    type="file" 
                    accept="application/pdf" 
                    onChange={onFileChange} 
                    disabled={isUploading}
                    id="resume-file-input"
                    className="hidden-input"
                />
                <label htmlFor="resume-file-input" className="file-input-label">
                    {isUploading ? 'Processing File...' : 'Click to Select PDF'}
                </label>
                
                {isUploading && (
                    <div className="upload-status">
                        <ProgressRing radius={30} stroke={4} progress={progress} />
                        <p>Analyzing skills with AI...</p>
                    </div>
                )}
            </div>
        </Card>
    );
};

export default ResumeUpload;