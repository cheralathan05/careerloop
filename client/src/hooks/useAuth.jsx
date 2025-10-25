import { useContext, useState, useCallback, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
// FIX 1: Import the dedicated authService functions instead of the generic apiClient
import authService from '../api/authService'; 
import { showToast } from '../utils/toastNotifications'; // Added for user feedback

/**
 * Custom hook to manage all authentication-related actions and state.
 * This hook connects the API service layer (authService) to the global state (AuthContext).
 */
const useAuth = () => {
    // Attempt to use the global context provided by AuthProvider
    const context = useContext(AuthContext);

    // --- Local State (Used if Context isn't provided/for fallback) ---
    // FIX 2: Check for 'accessToken' key
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('accessToken'));
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    // --- State Management Helpers (used by local logic) ---

    // Function to save token and user data upon successful authentication
    const saveAuthData = useCallback((token, userData) => {
        // FIX 3: Use the standardized key 'accessToken'
        localStorage.setItem('accessToken', token); 
        localStorage.setItem('user', JSON.stringify(userData));
        setIsAuthenticated(true);
        setUser(userData);
        setError(null);
        showToast('Login successful!', 'success');
    }, []);

    // Function to clear all local authentication data
    const clearAuthData = useCallback(() => {
        // FIX 4: Use the standardized key 'accessToken'
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        setIsAuthenticated(false);
        setUser(null);
        setError(null);
    }, []);

    // --- Effects & Initialization ---
    
    // Use useEffect to check token on mount and attempt to load user data
    useEffect(() => {
        // Only run local initialization if the hook is running outside the Provider (i.e., context is null)
        if (!context) { 
            const token = localStorage.getItem('accessToken');
            const storedUser = localStorage.getItem('user');
            
            if (token && storedUser) {
                // Initialize local state from storage
                try {
                    setUser(JSON.parse(storedUser));
                    setIsAuthenticated(true);
                } catch (e) {
                    console.error("Corrupted user data in local storage:", e);
                    clearAuthData(); // Clear corrupt data
                }
            }
            setLoading(false); // Assume initial check is done
        }
    }, [context, clearAuthData]);

    // --- Core Auth Logic ---

    const login = useCallback(async (credentials) => {
        setLoading(true);
        setError(null);
        try {
            // FIX 5: Use the imported authService.login function
            const response = await authService.login(credentials); 
            
            // If the context is available, use its saveAuthData function (which is passed via props)
            if (context?.saveAuthData) {
                context.saveAuthData(response.token, response.user || response.data);
            } else {
                // Otherwise, use the local one
                saveAuthData(response.token, response.user || response.data);
            }
            return response.user || response.data; // Return user object for component use
        } catch (err) {
            const msg = err.message || 'Login failed.';
            setError(msg);
            showToast(msg, 'error');
            throw err;
        } finally {
            setLoading(false);
        }
    // Dependency: Include context and context functions if available, or local functions
    }, [context, context?.saveAuthData, saveAuthData]);

    const logout = useCallback(async () => {
        setLoading(true);
        try {
            // FIX 6: Call the server-side logout function from authService
            await authService.logout(); 
            showToast('Logged out successfully.', 'info');
        } catch (err) {
            console.warn("Logout failed on server, clearing client state anyway.", err.message);
        } finally {
            // Clear client state regardless of server response
            if (context?.logout) {
                context.logout(); // Context's logout also clears local storage
            } else {
                clearAuthData(); // Local clear
            }
            setLoading(false);
        }
    }, [context, context?.logout, clearAuthData]);

    // --- Return Value ---
    
    // If AuthContext is defined, return the context value (this is the desired state). 
    if (context) {
        return { 
            ...context, 
            login, // Override context's placeholder login with the actual logic
            logout, // Override context's placeholder logout with the actual logic
            // The context state (user, isAuthenticated, loading) is used directly
        };
    }

    // Otherwise, return local state/functions (fallback)
    return { user, isAuthenticated, loading, error, login, logout, saveAuthData, setError };
};

export default useAuth;

