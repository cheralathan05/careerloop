import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import authService from "../../api/authService"; // Fixed service
import { Button } from "../common/Button"; // Fixed component
import { InputField } from "../ui/InputField"; // CRITICAL FIX: Use correct component name
import { AlertBox } from "../ui/AlertBox"; // CRITICAL FIX: Use standardized UI
import { showToast } from "../../utils/toastNotifications"; // Use fixed utility

const PasswordResetForm = ({ type = "forgot", token: propToken = "" }) => {
    const [form, setForm] = useState({
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [token, setToken] = useState(propToken);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const isForgot = type === "forgot";
    const navigate = useNavigate();
    const location = useLocation();

    // 🔍 Extract token from URL (for reset)
    useEffect(() => {
        if (!isForgot && !propToken) {
            const params = new URLSearchParams(location.search);
            const urlToken = params.get("token");
            setToken(urlToken);
            // Persist token in session storage for multi-step flow resilience (if needed)
            if (urlToken) sessionStorage.setItem('resetToken', urlToken);
            
            if (!urlToken) setError("Password reset link is missing or invalid.");
        } else if (propToken) {
            setToken(propToken);
        }
    }, [isForgot, propToken, location.search]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        if (error) setError("");
        if (message) setMessage("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setMessage("");

        try {
            if (isForgot) {
                // 📨 Forgot Password
                if (!form.email.trim()) return setError("Please enter your email.");

                const res = await authService.forgotPassword({ email: form.email });
                const successMsg = res.message || "Reset link sent! Check your inbox.";
                setMessage(successMsg);
                showToast(successMsg, 'info');
                setForm({ email: "", password: "", confirmPassword: "" });
                
            } else {
                // 🔐 Reset Password
                if (!token) return setError("Reset token is missing or expired. Request a new link.");

                const { password, confirmPassword } = form;
                if (!password || !confirmPassword) return setError("Please fill in both password fields.");
                if (password.length < 8) return setError("Password must be at least 8 characters long.");
                if (password !== confirmPassword) return setError("Passwords do not match.");

                const res = await authService.resetPassword({ token, newPassword: password });
                const successMsg = res.message || "Password reset successful! Redirecting...";
                setMessage(successMsg);
                sessionStorage.removeItem('resetToken'); 
                showToast(successMsg, 'success');

                setTimeout(() => navigate("/login", { replace: true }), 2500);
            }
        } catch (err) {
            // Use standardized error handling from fixed services
            const msg = err.message || "Operation failed. Please try again.";
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            // Applying theme-aware styling consistent with Login/Signup pages
            className="p-8 rounded-xl shadow-2xl w-full max-w-md bg-gray-800 border border-blue-700" 
        >
            <h2 className="text-3xl font-extrabold mb-6 text-center 
                             bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500">
                {isForgot ? "Forgot Access Key" : "Reset Access Credential"}
            </h2>

            {/* ✅ Message & Error Boxes (CRITICAL FIX: Using standardized AlertBox) */}
            {message && <AlertBox type="success" message={message} className="mb-4" />}
            {error && <AlertBox type="error" message={error} className="mb-4" />}

            {isForgot ? (
                // --- Forgot Password View ---
                <InputField
                    type="email"
                    name="email"
                    label="Email Address"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    required
                    autoFocus
                    disabled={loading || !!message}
                    className="mb-4"
                />
            ) : token ? (
                // --- Reset Password View ---
                <>
                    <InputField
                        type="password"
                        name="password"
                        label="New Password (min 8 chars)"
                        value={form.password}
                        onChange={handleChange}
                        placeholder="Enter your new password"
                        required
                        autoFocus
                        disabled={loading || !!message}
                        className="mb-4"
                    />
                    <InputField
                        type="password"
                        name="confirmPassword"
                        label="Confirm New Password"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        placeholder="Confirm your new password"
                        required
                        disabled={loading || !!message}
                        className="mb-4"
                    />
                </>
            ) : (
                // --- Missing Token View ---
                <p className="text-center text-gray-400 font-mono text-sm">
                    Access key is invalid. Please request a new one via the Forgot Password page.
                </p>
            )}

            <Button
                type="submit"
                loading={loading}
                disabled={loading || (isForgot && !form.email.trim()) || (!isForgot && !token)}
                className="w-full mt-4 bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-400 hover:to-cyan-400"
            >
                {loading
                    ? "Processing..."
                    : isForgot
                    ? "Send Reset Link"
                    : "CHANGE CREDENTIAL"}
            </Button>

            <div className="text-center mt-6">
                <button
                    type="button"
                    onClick={() => navigate("/login")}
                    className="text-sm text-cyan-400 hover:text-purple-400 transition"
                >
                    ← Back to Login
                </button>
            </div>
        </form>
    );
};

export default PasswordResetForm;
