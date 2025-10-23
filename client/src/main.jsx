import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

// Import global styles, including Tailwind's base and utility styles.
import './styles/index.css';

/**
 * @desc The entry point for the CareerLoop client application.
 * It initiates the React application and mounts the root component (App).
 */
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* The App component wraps all contexts (Auth, Onboarding, Theme, AI) 
      and the router, making the entire application functional.
    */}
    <App />
  </React.StrictMode>,
);