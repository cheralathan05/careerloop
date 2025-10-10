// client/vite.config.js

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Setup a proxy for API calls during development
  server: {
    proxy: {
      '/api': {
        // Point to your running Node.js backend
        target: 'http://localhost:5000', 
        changeOrigin: true,
        secure: false, // Set to true if your backend is HTTPS
      },
    },
    port: 5173, // Default Vite port
  }
});