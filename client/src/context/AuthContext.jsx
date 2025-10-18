// client/src/context/AuthContext.jsx

import { createContext, useContext, useState, useEffect } from 'react';
import authService from '../api/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // --- Check for existing token on mount ---
    useEffect(() => {
        const token = localStorage.getItem('userToken');
        if (token) {
            // Optional: decode JWT to extract user info or call /api/auth/me
            // Here we assume token is valid and we fetch user info from server
            setUser({ token }); // You can extend with decoded info
        }
        setIsLoading(false);
    }, []);

    // --- Login Function ---
    const login = async (credentials) => {
        setIsLoading(true);
        try {
            const data = await authService.login(credentials);
            // Login returns user info + token
            setUser({
                _id: data._id,
                name: data.name,
                email: data.email,
            });
            setIsLoading(false);
            return data;
        } catch (err) {
            setIsLoading(false);
            throw err;
        }
    };

    // --- Logout Function ---
    const logout = () => {
        authService.logout();
        setUser(null);
    };

    const value = {
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        // Extend with signup, verifyOtp, forgotPassword, resetPassword if needed
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// --- Custom Hook ---
export const useAuth = () => useContext(AuthContext);
