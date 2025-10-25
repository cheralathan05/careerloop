// client/vite.config.js

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path, { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
    },
    // --- SPA fallback for React Router ---
    historyApiFallback: true, // This tells Vite to serve index.html for all frontend routes
  },
  resolve: {
    alias: {
      '@': path .resolve(__dirname, './src'),
    },
  },
});
