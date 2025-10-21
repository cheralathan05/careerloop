// src/hooks/useFileUpload.js

import { useState } from 'react';
import uploadService from '../services/uploadService';
import toastNotifications from '../utils/toastNotifications';

export default function useFileUpload() {
    const [file, setFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile && selectedFile.type === 'application/pdf') {
            setFile(selectedFile);
            setUploadProgress(0);
            uploadFile(selectedFile);
        } else {
            toastNotifications.error("Please upload a PDF file for your resume.");
            setFile(null);
        }
    };

    const uploadFile = async (fileToUpload) => {
        setIsUploading(true);
        setUploadProgress(10); // Start progress bar

        try {
            // Mock the upload and AI parsing process
            await uploadService.uploadResume(fileToUpload, setUploadProgress); 
            toastNotifications.success("Resume uploaded and skills mapped!");

            // In a real scenario, this would return parsed skills to update the form data
            // const parsedSkills = result.data.skills; 
        } catch (error) {
            toastNotifications.error("Resume upload failed.");
            setUploadProgress(0);
        } finally {
            setIsUploading(false);
            setUploadProgress(100);
        }
    };

    return {
        file,
        isUploading,
        uploadProgress,
        handleFileChange,
    };
}