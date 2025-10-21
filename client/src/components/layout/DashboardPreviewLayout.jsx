// src/components/layout/DashboardPreviewLayout.jsx

import React from 'react';

const DashboardPreviewLayout = ({ children }) => {
    return (
        <div className="dashboard-preview-layout-container">
            <div className="preview-animation">
                {/*  */}
                <img src="/illustrations/dashboard-preview.svg" alt="Dashboard Preview" />
            </div>
            <div className="preview-content">
                {children}
            </div>
        </div>
    );
};

export default DashboardPreviewLayout;