// src/services/uploadService.js

const uploadService = {
    uploadResume: (file, setProgressCallback) => {
        return new Promise((resolve, reject) => {
            console.log(`[Service] Starting upload for: ${file.name}`);
            
            // Simulate progress updates
            let progress = 0;
            const interval = setInterval(() => {
                progress += 10;
                setProgressCallback(progress);
                if (progress >= 90) {
                    clearInterval(interval);
                    // Simulate successful parsing delay
                    setTimeout(() => {
                        setProgressCallback(100);
                        resolve({ success: true, message: 'File processed', data: { skills: ['React', 'Node', 'Figma'] } });
                    }, 500);
                }
            }, 100);

            // Mock failure 10% of the time
            if (Math.random() < 0.1) {
                clearInterval(interval);
                reject(new Error("Network error during upload."));
            }
        });
    }
};

export default uploadService;