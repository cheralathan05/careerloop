// client/src/components/auth/AuthForm.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import authService from "../../api/authService";
import Button from "../common/Button";
import Input from "../common/Input";

const AuthForm = ({ type = "login" }) => {
  const navigate = useNavigate();
  const isLogin = type === "login";
  const { login: contextLogin } = useAuth();

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
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return; // prevent double click
    setLoading(true);
    setError("");

    try {
      if (isLogin) {
        // 🔐 LOGIN FLOW
        const { email, password } = formData;
        await contextLogin({ email, password });
        navigate("/dashboard");
      } else {
        // 🧩 SIGNUP FLOW
        const { name, email, password } = formData;
        const signupRes = await authService.signup({ name, email, password });

        const userId =
          signupRes?._id ||
          signupRes?.user?._id ||
          signupRes?.userId ||
          signupRes?.data?._id;
        const userEmail =
          signupRes?.email || signupRes?.user?.email || email;

        if (!userId) {
          throw new Error(
            "Signup succeeded, but no user ID returned for OTP verification."
          );
        }

        navigate("/verify-otp", { state: { userId, email: userEmail } });
      }
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "An unexpected authentication error occurred.";
      console.error("AuthForm Error:", message, err);
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  // --- RENDER ---
  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 border rounded-lg shadow-md w-full max-w-sm bg-white"
    >
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        {isLogin ? "Log In" : "Sign Up"}
      </h2>

      {!isLogin && (
        <Input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Full Name"
          required
        />
      )}

      <Input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email Address"
        required
      />

      <Input
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="Password"
        required
      />

      {error && (
        <p className="text-red-500 text-sm mt-2 font-medium text-center">
          {error}
        </p>
      )}

      <Button
        type="submit"
        disabled={loading}
        className="w-full mt-4 disabled:opacity-70"
      >
        {loading
          ? isLogin
            ? "Logging in..."
            : "Creating account..."
          : isLogin
          ? "Login"
          : "Sign Up"}
      </Button>

      {isLogin && (
        <div className="text-right mt-2">
          <Link
            to="/forgot-password"
            className="text-sm text-indigo-600 hover:text-indigo-800 transition duration-150"
          >
            Forgot Password?
          </Link>
        </div>
      )}
    </form>
  );
};

export default AuthForm;
