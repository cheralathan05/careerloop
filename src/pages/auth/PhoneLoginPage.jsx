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
      if (success) setStep("code");
      else setError(authError || "Failed to send code.");
    } catch (err) {
      setError(err.message || "Unexpected error.");
    }
    setLoading(false);
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
    }
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow rounded">
      {step === "phone" ? (
        <form onSubmit={handleSendCode} className="space-y-4">
          <div>
            <label>Phone Number</label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
              placeholder="+1234567890"
              className="input-field"
              disabled={loading}
            />
          </div>
          {error && <p className="text-red-500">{error}</p>}
          <button type="submit" disabled={loading}>
            {loading ? "Sending code..." : "Send Verification Code"}
          </button>
          <div id="recaptcha-container"></div>
        </form>
      ) : (
        <form onSubmit={handleConfirmCode} className="space-y-4">
          <div>
            <label>Verification Code</label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
              maxLength={6}
              className="input-field"
              disabled={loading}
            />
          </div>
          {error && <p className="text-red-500">{error}</p>}
          <button type="submit" disabled={loading}>
            {loading ? "Verifying..." : "Confirm Code"}
          </button>
          <button type="button" onClick={() => setStep("phone")}>
            Back to Phone Number
          </button>
        </form>
      )}
    </div>
  );
};

export default PhoneLoginForm;
