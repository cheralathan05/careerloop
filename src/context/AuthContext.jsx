// src/context/AuthContext.jsx (Updated)

import React, { 
    createContext, 
    useState, 
    useEffect 
} from 'react';
import { 
    auth 
} from '../firebase/firebase';
import { 
    onAuthStateChanged 
} from 'firebase/auth';
import { 
    logout, 
    signUp, 
    login, 
    googleLogin, 
    resetPassword,
    sendPhoneCode, // NEW
    verifyPhoneCode, // NEW
    sendVerificationEmail, // NEW
    updateUserPassword, // NEW
} from '../firebase/authService';
import AuthLoader from '../components/auth/AuthLoader';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, user => {
            setCurrentUser(user);
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const value = {
        currentUser,
        signUp,
        login,
        logout,
        googleLogin,
        resetPassword,
        sendPhoneCode, // Exposed to use in PhoneLoginForm
        verifyPhoneCode, // Exposed to use in PhoneLoginForm
        sendVerificationEmail,
        updateUserPassword,
        // The firebase auth instance is useful for managing the current user directly
        // Note: Not usually exposed, but helpful for advanced features.
        firebaseAuth: auth, 
    };

    if (loading) {
        return <AuthLoader />; 
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};