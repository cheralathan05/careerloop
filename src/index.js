// src/index.js

import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css'; // Import global Tailwind CSS styles

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);