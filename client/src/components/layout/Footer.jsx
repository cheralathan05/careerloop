// client/src/components/layout/Footer.jsx

import React from 'react';

const Footer = () => {
    const year = new Date().getFullYear();
    return (
        <footer className="bg-gray-100 border-t border-gray-200 py-4 mt-auto">
            <div className="container mx-auto px-4 text-center text-sm text-gray-600">
                &copy; {year} AuthFlow App. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;