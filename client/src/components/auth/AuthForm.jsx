import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useAuth from '../../hooks/useAuth'; // <-- Correct: Getting the default export
import authService from "../../api/authService"; // Fixed service
import { Button } from "../common/Button"; // CRITICAL FIX: Use named export
import { InputField } from "../ui/InputField"; // CRITICAL FIX: Use named export and correct component name
import { AlertBox } from "../ui/AlertBox"; // CRITICAL FIX: Import standardized error UI
import { showToast } from "../../utils/toastNotifications"; // Import fixed utility

const AuthForm = ({ type = "login" }) => {
    const navigate = useNavigate();
    const isLogin = type === "login";
    
    // Destructure the actual login function from the fixed hook
    const { login } = useAuth(); 

    const [formData, setFormData] = useState({
        email: "",
        password: "",
        ...(type === "signup" && { name: "" }),
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // --- HANDLERS ---
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (error) setError(""); // Clear error on new input
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (loading) return; 
        setLoading(true);
        setError("");

        try {
            if (isLogin) {
                // 🔐 LOGIN FLOW
                const { email, password } = formData;
                // Use the login function provided by the fixed useAuth hook
                await login({ email, password }); 
                // Navigation to dashboard handled implicitly by the ProtectedRoute/AuthContext flow
                // No explicit navigate is needed here after successful login, but we'll leave it for immediate redirection
                navigate("/dashboard", { replace: true });

            } else {
                // 🧩 SIGNUP FLOW
                const { name, email, password } = formData;
                const signupRes = await authService.signup({ name, email, password });

                // Backend signup is complete, navigate to OTP verification
                // Ensure email is passed in the state for the VerifyOTP page context
                const userEmail = signupRes?.email || signupRes?.user?.email || email;

                showToast(`Registration successful! Sending access key to ${userEmail}.`, 'info');
                
                // Navigate to OTP verification
                navigate("/verify-otp", { state: { email: userEmail } }); 
            }
        } catch (err) {
            // Error message extracted from the re-thrown error in apiClient/authService
            const message = err.message || "An unexpected authentication error occurred.";
            setError(message);
            // NOTE: apiClient handles network/401 errors via toast, but we display form errors here
        } finally {
            setLoading(false);
        }
    };

    // --- RENDER ---
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Standard AlertBox for Form Errors */}
            {error && <AlertBox type="error" message={error} className="mb-4" />}

            {!isLogin && (
                // FIX: Using the standardized InputField component
                <InputField
                    type="text"
                    name="name"
                    label="Full Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />
            )}

            {/* FIX: Using the standardized InputField component */}
            <InputField
                type="email"
                name="email"
                label="Email Address"
                value={formData.email}
                onChange={handleChange}
                required
            />

            {/* FIX: Using the standardized InputField component */}
            <InputField
                type="password"
                name="password"
                label="Password"
                value={formData.password}
                onChange={handleChange}
                required
            />

            <Button
                type="submit"
                disabled={loading}
                className="w-full mt-4 disabled:opacity-70"
                loading={loading} // Use loading prop instead of manual ternary for text
                variant="primary"
            >
                {isLogin ? "Access Console" : "Initiate Registration"}
            </Button>

            {/* Link to Forgot Password is handled in the parent component (Login.jsx) */}
            {/* If not logged in, show this to avoid duplicating links in Login.jsx */}
            {!isLogin && (
                <div className="text-center mt-4">
                    <Link
                        to="/forgot-password"
                        className="text-sm text-cyan-400 hover:text-cyan-300 transition duration-150"
                    >
                        Forgot Password?
                    </Link>
                </div>
            )}
        </form>
    );
};

export default AuthForm;
