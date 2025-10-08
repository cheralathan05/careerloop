import React, { useState } from "react";
import { resetPassword } from "../../firebase/authService";
import { Link } from "react-router-dom";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const { success, error: resetError } = await resetPassword(email);
      if (success) {
        setMessage("Password reset email sent! Check your inbox.");
      } else {
        setError(resetError || "Failed to send reset email.");
      }
    } catch (err) {
      setError("Unexpected error occurred.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md space-y-4">
        <h1 className="text-2xl font-bold text-center text-gray-800">
          Reset Password
        </h1>
        <p className="text-sm text-gray-600 text-center">
          Enter your email address to reset your password.
        </p>

        <form onSubmit={handleReset} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {message && (
            <p className="text-green-600 text-sm bg-green-50 p-2 rounded">
              {message}
            </p>
          )}
          {error && (
            <p className="text-red-600 text-sm bg-red-50 p-2 rounded">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 rounded bg-blue-600 text-white font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50`}
          >
            {loading ? "Sending..." : "Send Reset Email"}
          </button>
        </form>

        <p className="text-sm text-center text-gray-500">
          Remembered your password?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
