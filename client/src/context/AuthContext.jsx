// client/src/context/AuthContext.jsx

import { createContext, useContext, useState, useEffect } from 'react';
import authService from '../api/authService';
// Assuming you have a utility to decode JWT to get user info without server hit
// import jwtDecode from 'jwt-decode'; 

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Check for existing token on mount
    useEffect(() => {
        const token = localStorage.getItem('userToken');
        if (token) {
            // In a real app, you'd decode the token or verify it with the server
            // For simplicity, we'll assume the token is valid for now.
            // A more robust way is to make an /api/auth/me request.
            setUser({ /* User data from decoded token or server check */ });
        }
        setIsLoading(false);
    }, []);

    // Function to handle login
    const login = async (credentials) => {
        setIsLoading(true);
        try {
            const data = await authService.login(credentials);
            // Assuming login response contains token and user info
            setUser(data.user); 
            // The token is saved in authService, now we update the state
            setIsLoading(false);
            return data;
        } catch (error) {
            setIsLoading(false);
            throw error; // Re-throw to be handled by the component
        }
    };

    // Function to handle logout
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
        // Add signup, verifyOtp, etc. functionalities as needed
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the context
export const useAuth = () => {
    return useContext(AuthContext);
};