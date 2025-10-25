import apiClient from './apiClient';
// Removed: import { showToast } from '../utils/toastNotifications'; // Toast is handled by apiClient

const UPLOAD_BASE_URL = 'upload'; // Appends to VITE_API_BASE_URL (e.g., /api/upload)

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
        // Use a standard Error object
        throw new Error("No file selected for upload.");
    }

    const formData = new FormData();
    // Use a standard field name like 'resume' or 'file' based on backend expectation
    formData.append('resume', file); 
    
    try {
        // POST /api/upload/resume
        // ENHANCEMENT: Removed explicit 'Content-Type' header. Axios handles 'multipart/form-data'
        // correctly when given a FormData object.
        const response = await apiClient.post(`${UPLOAD_BASE_URL}/resume`, formData);

        // ENHANCEMENT: Safely extract data, checking for nesting under 'data' or being the root.
        const uploadData = response.data || response;
        
        if (uploadData.url && Array.isArray(uploadData.skills)) {
            return {
                fileUrl: uploadData.url, 
                extractedSkills: uploadData.skills, 
            };
        } else {
            // Throw a general error if the server response shape is unexpected
            throw new Error(uploadData.message || 'Server failed to process resume or returned missing data.');
        }

    } catch (error) {
        // The error thrown from the API call will be caught here (e.g., Axios error)
        // We override the generic error message for common upload issues (413: Payload Too Large)
        
        let errorMessage = 'Upload failed. Check file type and size.';
        
        // Check for specific error status or message that indicates file size limit
        if (error.message.includes('413')) {
            errorMessage = 'File is too large. Please upload a smaller file.';
        } else if (error.message.includes('Network Error')) {
            errorMessage = 'Network connection failed during upload.';
        }
            
        // Throw the refined error message
        throw new Error(errorMessage);
    }
};

export default { uploadResume };
