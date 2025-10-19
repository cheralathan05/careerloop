// client/src/components/layout/Footer.jsx

import React from 'react';
import { Link } from 'react-router-dom'; // 🚨 NEW: For navigation links

const Footer = React.memo(() => {
    const year = new Date().getFullYear();
    
    return (
        // Use 'flex-shrink-0' to ensure the footer doesn't shrink if the content is small
        // The py-4 provides padding above and below
        <footer className="bg-gray-50 border-t border-gray-200 py-4 flex-shrink-0">
            <div className="container mx-auto px-4 text-sm text-gray-600">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    
                    {/* 1. Copyright Information */}
                    <p className="text-center md:text-left mb-2 md:mb-0">
                        &copy; {year} AuthFlow App. All rights reserved.
                    </p>

                    {/* 2. Layout Links (Optional, but common in footers) */}
                    <div className="flex space-x-4">
                        {/* Use Link components for routing */}
                        <Link 
                            to="/privacy" 
                            className="hover:text-indigo-600 transition duration-150"
                        >
                            Privacy
                        </Link>
                        <Link 
                            to="/terms" 
                            className="hover:text-indigo-600 transition duration-150"
                        >
                            Terms
                        </Link>
                        <Link 
                            to="/contact" 
                            className="hover:text-indigo-600 transition duration-150"
                        >
                            Contact
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
});

export default Footer;