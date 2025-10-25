import { useState, useCallback, useMemo } from 'react';
import { uploadResume } from '../services/uploadService';
import { showToast } from '../utils/toastNotifications';

/**
 * @typedef {object} FileUploadState
 * @property {File | null} file - The currently selected file object.
 * @property {boolean} isUploading - True while the file is being uploaded/processed.
 * @property {string | null} uploadError - Any error message from the last upload attempt.
 * @property {Array<string>} extractedSkills - Skills returned by the server parser.
 * @property {string | null} fileUrl - The public URL of the uploaded file.
 */

/**
 * @desc Custom hook to manage the state and logic for file uploads.
 * @returns {{
 * state: FileUploadState,
 * handleFileSelect: (file: File) => void,
 * reset: () => void,
 * uploadAndExtractSkills: (onSuccess: (skills: Array<string>, fileUrl: string) => void) => Promise<void>
 * }}
 */
export const useFileUpload = () => {
    const [fileState, setFileState] = useState({
        file: null,
        isUploading: false,
        uploadError: null,
        extractedSkills: [],
        fileUrl: null, // FIX: Added fileUrl to the state definition
    });

    const handleFileSelect = useCallback((selectedFile) => {
        if (selectedFile) {
            setFileState(prev => ({
                ...prev,
                file: selectedFile,
                uploadError: null,
            }));
        }
    }, []);

    const reset = useCallback(() => {
        setFileState({
            file: null,
            isUploading: false,
            uploadError: null,
            extractedSkills: [],
            fileUrl: null, // FIX: Reset fileUrl
        });
        showToast('File selection cleared.', 'info'); // Added a toast for user confirmation
    }, []);

    const uploadAndExtractSkills = useCallback(async (onSuccess) => {
        if (!fileState.file) {
            const errorMsg = "Please select a file first.";
            setFileState(prev => ({ ...prev, uploadError: errorMsg }));
            showToast(errorMsg, 'warning');
            return;
        }

        setFileState(prev => ({ ...prev, isUploading: true, uploadError: null }));

        try {
            // Call the fixed service function
            const { fileUrl, extractedSkills } = await uploadResume(fileState.file);
            
            setFileState(prev => ({
                ...prev,
                extractedSkills,
                fileUrl, // FIX: Now correctly tracked in state
            }));
            
            showToast('Resume uploaded and processed successfully!', 'success');
            onSuccess(extractedSkills, fileUrl);

        } catch (error) {
            const errorMessage = error.message || 'An unknown upload error occurred.';
            setFileState(prev => ({ 
                ...prev, 
                uploadError: errorMessage, 
                extractedSkills: [],
                fileUrl: null,
            }));
            // Service handles generic API errors, but we toast specific file errors here
            if (!errorMessage.includes('401') && !errorMessage.includes('403')) {
                showToast(errorMessage, 'error'); 
            }
            // Re-throw the error for component handling
            throw error; 
        } finally {
            setFileState(prev => ({ ...prev, isUploading: false }));
        }
    }, [fileState.file]);

    const value = useMemo(() => ({
        state: fileState,
        handleFileSelect,
        reset,
        uploadAndExtractSkills,
    }), [fileState, handleFileSelect, reset, uploadAndExtractSkills]);

    return value;
};