// src/main.jsx

import React from 'react';
import ReactDOM from 'react-dom/client'; // Use createRoot for React 18
import App from './App.jsx'; // Ensure .jsx extension if your bundler needs it
import './index.css'; // Import global Tailwind CSS styles

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);