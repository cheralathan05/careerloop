import { useState, useCallback, useMemo } from 'react';
import { uploadResume } from '../services/uploadService';
import { showToast } from '../utils/toastNotifications';

/**
 * @typedef {object} FileUploadState
 * @property {File | null} file - The currently selected file object.
 * @property {boolean} isUploading - True while the file is being uploaded/processed.
 * @property {string | null} uploadError - Any error message from the last upload attempt.
 * @property {Array<string>} extractedSkills - Skills returned by the server parser.
 */

/**
 * @desc Custom hook to manage the state and logic for file uploads.
 * @returns {{
 * state: FileUploadState,
 * handleFileSelect: (file: File) => void,
 * uploadAndExtractSkills: (onSuccess: (skills: Array<string>, fileUrl: string) => void) => Promise<void>
 * }}
 */
export const useFileUpload = () => {
    const [fileState, setFileState] = useState({
        file: null,
        isUploading: false,
        uploadError: null,
        extractedSkills: [],
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
        });
    }, []);

    const uploadAndExtractSkills = useCallback(async (onSuccess) => {
        if (!fileState.file) {
            setFileState(prev => ({ ...prev, uploadError: "Please select a file first." }));
            return;
        }

        setFileState(prev => ({ ...prev, isUploading: true, uploadError: null }));

        try {
            const { fileUrl, extractedSkills } = await uploadResume(fileState.file);
            
            setFileState(prev => ({
                ...prev,
                extractedSkills,
                fileUrl, 
            }));
            
            onSuccess(extractedSkills, fileUrl);

        } catch (error) {
            setFileState(prev => ({ 
                ...prev, 
                uploadError: error.message, 
                extractedSkills: [],
            }));
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