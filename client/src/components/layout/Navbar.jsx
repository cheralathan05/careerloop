import React from 'react';
import useAuth from '../../hooks/useAuth'; // <-- Correct: Getting the default export
import { useTheme } from '../../context/ThemeContext'; // Fixed context
import { Button } from '../common/Button';
import { Moon, Sun, LogOut, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * @desc Standard application navigation bar for protected routes (Dashboard).
 */
export const Navbar = () => {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();

    return (
        <header className="w-full bg-white dark:bg-gray-800 shadow-lg border-b dark:border-gray-700 sticky top-0 z-40">
            <div className="max-w-6xl mx-auto flex justify-between items-center h-16 px-4 sm:px-6 lg:px-8">
                
                {/* Logo / Home Link */}
                <Link to={user ? "/dashboard" : "/login"} className="flex items-center space-x-2 link-enhanced">
                    <TrendingUp className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
                    <span className="text-2xl font-black text-gray-900 dark:text-white">
                        CareerLoop
                    </span>
                </Link>

                <div className="flex items-center space-x-3">
                    
                    {/* Theme Toggle */}
                    <Button 
                        onClick={toggleTheme} 
                        variant="secondary" 
                        className="p-2 w-10 h-10 flex-shrink-0" 
                        size="sm" 
                        aria-label="Toggle Theme"
                    >
                        {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                    </Button>

                    {user ? (
                        <div className="flex items-center space-x-3">
                            {/* User Greeting (Hidden on small screens) */}
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden sm:inline truncate max-w-[120px]">
                                Hi, {user.name?.split(' ')[0] || user.email?.split('@')[0] || 'User'}
                            </span>

                            {/* Logout Button */}
                            <Button 
                                onClick={logout} 
                                variant="outline" 
                                size="sm" 
                                icon={LogOut}
                                className="flex-shrink-0"
                                aria-label="Logout"
                            >
                                Logout
                            </Button>
                        </div>
                    ) : (
                        /* Sign In Link for unauthenticated users */
                        <Link to="/login">
                            <Button variant="primary" size="sm">
                                Sign In
                            </Button>
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
};
