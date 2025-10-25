import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Button from "../common/Button";
import Input from "../common/Input";
import authService from "../../api/authService";

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
        setMessage(res.message || "Reset link sent! Check your inbox.");
        setForm({ email: "", password: "", confirmPassword: "" });
      } else {
        // 🔐 Reset Password
        if (!token)
          return setError(
            "Reset token is missing or expired. Request a new link."
          );

        const { password, confirmPassword } = form;
        if (!password || !confirmPassword)
          return setError("Please fill in both password fields.");
        if (password.length < 8)
          return setError("Password must be at least 8 characters long.");
        if (password !== confirmPassword)
          return setError("Passwords do not match.");

        const res = await authService.resetPassword({ token, newPassword: password });
        setMessage(res.message || "Password reset successful! Redirecting...");
        setForm({ email: "", password: "", confirmPassword: "" });

        setTimeout(() => navigate("/login"), 2500);
      }
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        "Operation failed. Please try again.";
      setError(msg);
      console.error("PasswordResetForm Error:", msg, err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 border rounded-lg shadow-xl w-full max-w-sm bg-white mx-auto my-10"
    >
      <h2 className="text-3xl font-extrabold mb-6 text-center text-indigo-600">
        {isForgot ? "Forgot Password" : "Reset Password"}
      </h2>

      {/* ✅ Success Message */}
      {message && (
        <div
          className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4 text-sm animate-fade-in"
          role="alert"
        >
          {message}
        </div>
      )}

      {/* ⚠️ Error Message */}
      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 text-sm animate-fade-in"
          role="alert"
        >
          {error}
        </div>
      )}

      {isForgot ? (
        <Input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Enter your email"
          required
          autoFocus
          disabled={loading}
          className="mb-4"
        />
      ) : token ? (
        <>
          <Input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="New Password (min 8 chars)"
            required
            autoFocus
            disabled={loading}
            className="mb-4"
          />
          <Input
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm New Password"
            required
            disabled={loading}
            className="mb-4"
          />
        </>
      ) : (
        <p className="text-center text-gray-500">
          Please use the full link sent to your email to reset your password.
        </p>
      )}

      <Button
        type="submit"
        disabled={loading || (!isForgot && !token)}
        className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white disabled:bg-indigo-300 transition-all"
      >
        {loading
          ? "Processing..."
          : isForgot
          ? "Send Reset Link"
          : "Change Password"}
      </Button>

      <div className="text-center mt-4">
        <button
          type="button"
          onClick={() => navigate("/login")}
          className="text-sm text-gray-600 hover:text-indigo-600 transition"
        >
          ← Back to Login
        </button>
      </div>
    </form>
  );
};

export default PasswordResetForm;
