// src/utils/toastNotifications.js

/**
 * Mock implementation for a toast notification system.
 * In a real application, this would use a library like react-hot-toast or similar.
 */
const toastNotifications = {
    success: (message) => {
        console.log(`[TOAST SUCCESS] 🎉 ${message}`);
        // alert(`SUCCESS: ${message}`); // Use for extreme mocking
    },
    error: (message) => {
        console.error(`[TOAST ERROR] ❌ ${message}`);
        // alert(`ERROR: ${message}`);
    },
    info: (message) => {
        console.log(`[TOAST INFO] ℹ️ ${message}`);
    }
};

export default toastNotifications;