import apiClient from './apiClient';
import { showToast } from '../utils/toastNotifications';

const UPLOAD_BASE_URL = 'upload';

/**
 * @typedef {object} UploadResult
 * @property {string} fileUrl - The public URL of the uploaded file.
 * @property {Array<string>} extractedSkills - List of skills parsed from the resume.
 */

/**
 * @desc Uploads a resume file to the server for processing (Cloudinary/AI parser).
 * @param {File} file - The file object selected by the user.
 * @returns {Promise<UploadResult>} The result containing the file URL and skills.
 */
export const uploadResume = async (file) => {
    if (!file) {
        throw new Error("No file selected for upload.");
    }

    const formData = new FormData();
    formData.append('file', file);
    
    try {
        // POST /api/upload/resume
        // CRITICAL: Must use multipart/form-data headers
        const response = await apiClient.post(`${UPLOAD_BASE_URL}/resume`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        if (response.success && response.data) {
            return {
                fileUrl: response.data.url, 
                extractedSkills: response.data.skills, 
            };
        } else {
            throw new Error(response.message || 'Server failed to process resume.');
        }

    } catch (error) {
        // apiClient interceptor handles toast
        const errorMessage = error.message.includes('413') 
            ? 'File is too large.' 
            : 'Upload failed. Check file type and size.';
            
        throw new Error(errorMessage);
    }
};