import React, { useState, useEffect } from "react";
import { sendPhoneCode, confirmPhoneCode } from "../../firebase/authService";
import { initializeRecaptcha } from "../../utils/recaptchaConfig";
import { useNavigate } from "react-router-dom";

const PhoneLoginForm = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState("phone");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    initializeRecaptcha();
  }, []);

  const handleSendCode = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const formattedPhone = phoneNumber.startsWith("+")
        ? phoneNumber
        : `+${phoneNumber}`;
      const { success, error: authError } = await sendPhoneCode(
        formattedPhone,
        window.recaptchaVerifier
      );

      if (success) {
        setStep("code");
      } else {
        setError(authError || "Failed to send code.");
      }
    } catch (err) {
      setError(err.message || "Unexpected error.");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmCode = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { user, error: authError } = await confirmPhoneCode(code);
      if (user) navigate("/dashboard");
      else setError(authError || "Invalid code.");
    } catch (err) {
      setError(err.message || "Unexpected error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded space-y-6">
      {step === "phone" ? (
        <form onSubmit={handleSendCode} className="space-y-4">
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <input
              id="phone"
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
              placeholder="+1234567890"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
          </div>

          {error && (
            <p className="text-red-600 bg-red-50 p-2 rounded text-sm">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 rounded bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Sending code..." : "Send Verification Code"}
          </button>

          <div id="recaptcha-container" className="mt-4"></div>
        </form>
      ) : (
        <form onSubmit={handleConfirmCode} className="space-y-4">
          <div>
            <label htmlFor="code" className="block text-sm font-medium text-gray-700">
              Verification Code
            </label>
            <input
              id="code"
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
              maxLength={6}
              placeholder="Enter code"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
          </div>

          {error && (
            <p className="text-red-600 bg-red-50 p-2 rounded text-sm">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 rounded bg-green-600 text-white font-medium hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Confirm Code"}
          </button>

          <button
            type="button"
            onClick={() => setStep("phone")}
            className="w-full py-2 px-4 rounded border border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Back to Phone Number
          </button>
        </form>
      )}
    </div>
  );
};

export default PhoneLoginForm;
