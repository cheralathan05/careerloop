// client/src/components/common/Loader.jsx

import React from 'react';

const Loader = ({ size = 'h-10 w-10', color = 'border-indigo-500' }) => {
    return (
        <div 
            className={`animate-spin rounded-full ${size} border-t-2 border-b-2 ${color}`}
            role="status"
        >
            <span className="sr-only">Loading...</span>
        </div>
    );
};

export default Loader;