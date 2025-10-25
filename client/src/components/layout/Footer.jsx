import React from 'react';

/**
 * @desc Standard application footer component.
 * Should be placed outside the main content area in your application layout.
 */
export const Footer = () => {
    return (
        <footer className="w-full bg-gray-100 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 p-4 mt-auto">
            <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                
                {/* Copyright */}
                <p>&copy; {new Date().getFullYear()} CareerLoop. All rights reserved.</p>

                {/* Links */}
                <div className="flex space-x-4 mt-2 sm:mt-0">
                    <a 
                        href="#" 
                        className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-150"
                    >
                        Privacy Policy
                    </a>
                    <a 
                        href="#" 
                        className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-150"
                    >
                        Terms of Service
                    </a>
                    <a 
                        href="mailto:support@careerloop.com" 
                        className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-150"
                    >
                        Support
                    </a>
                </div>
            </div>
        </footer>
    );
};
