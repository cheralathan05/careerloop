import React, { createContext, useState, useEffect } from 'react';
import authService from '../api/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for user in localStorage on initial load
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const handleAuthResponse = (data) => {
        const userData = {
            email: data.email,
            name: data.name,
            token: data.token
        };
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        return userData;
    };

    const login = async (email, password) => {
        const { data } = await authService.login(email, password);
        return handleAuthResponse(data);
    };

    const verifyOtp = async (userId, otp) => {
        const { data } = await authService.verifyOtp(userId, otp);
        return handleAuthResponse(data);
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    const value = {
        user,
        isAuthenticated: !!user,
        loading,
        login,
        logout,
        verifyOtp,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;