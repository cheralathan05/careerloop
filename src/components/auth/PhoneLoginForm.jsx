// src/components/auth/PhoneLoginForm.jsx

import React, { 
    useState, 
    useEffect, 
    useRef 
} from 'react';
import { 
    useAuth 
} from '../../hooks/useAuth';
import { 
    setupRecaptcha 
} from '../../utils/security';
import { 
    useNavigate 
} from 'react-router-dom';

const RECAPTCHA_CONTAINER_ID = 'recaptcha-container';

const PhoneLoginForm = () => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [step, setStep] = useState(1); // 1: Enter Phone, 2: Enter Code
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const recaptchaVerifierRef = useRef(null);
    const { 
        sendPhoneCode, 
        verifyPhoneCode 
    } = useAuth();
    const navigate = useNavigate();

    // 1. Setup reCAPTCHA on component mount
    useEffect(() => {
        try {
            // Note: The verifier needs to be rendered only once.
            if (!recaptchaVerifierRef.current) {
                recaptchaVerifierRef.current = setupRecaptcha(RECAPTCHA_CONTAINER_ID);
                // Ensure the container is visible for reCAPTCHA to work correctly,
                // even if styled as 'invisible'.
            }
        } catch (e) {
            console.error("Error setting up reCAPTCHA:", e);
            setError("Security check failed. Please refresh.");
        }
    }, []);

    // 2. Handle sending the SMS code
    const handleSendCode = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Firebase requires the E.164 format: '+[country code][number]'
        const formattedNumber = phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`;

        if (!recaptchaVerifierRef.current) {
            setError('Security check not initialized. Please try again.');
            setLoading(false);
            return;
        }

        try {
            await sendPhoneCode(formattedNumber, recaptchaVerifierRef.current);
            setStep(2); // Move to the verification step
        } catch (err) {
            console.error("Error sending code:", err);
            setError('Failed to send code. Check your number or try again.');
        } finally {
            setLoading(false);
        }
    };

    // 3. Handle verifying the SMS code
    const handleVerifyCode = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await verifyPhoneCode(verificationCode);
            navigate('/dashboard'); // Success!
        } catch (err) {
            console.error("Error verifying code:", err);
            setError('Invalid code. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 bg-white rounded-lg shadow-xl w-full max-w-md">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">Phone Sign In</h2>

            {error && (
                <p className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
                    {error}
                </p>
            )}

            {/* **The Hidden reCAPTCHA Container (Crucial for Firebase)** */}
            <div id={RECAPTCHA_CONTAINER_ID} className="mb-4"></div>

            {step === 1 && (
                <form onSubmit={handleSendCode}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="phone">
                            Phone Number (e.g., +1234567890)
                        </label>
                        <input
                            type="tel"
                            id="phone"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="+1234567890"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out w-full"
                        disabled={loading}
                    >
                        {loading ? 'Sending...' : 'Send Verification Code'}
                    </button>
                </form>
            )}

            {step === 2 && (
                <form onSubmit={handleVerifyCode}>
                    <p className="mb-4 text-sm text-green-700">Code sent to {phoneNumber}.</p>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="code">
                            Verification Code
                        </label>
                        <input
                            type="text"
                            id="code"
                            value={verificationCode}
                            onChange={(e) => setVerificationCode(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="123456"
                            required
                            maxLength="6"
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out w-full"
                        disabled={loading}
                    >
                        {loading ? 'Verifying...' : 'Verify and Log In'}
                    </button>
                    <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="mt-4 text-sm text-indigo-600 hover:text-indigo-800"
                    >
                        Go back
                    </button>
                </form>
            )}
        </div>
    );
};

export default PhoneLoginForm;