// src/pages/auth/ForgotPasswordPage.jsx

import React, { 
    useState 
} from 'react';
import { 
    useAuth 
} from '../../hooks/useAuth';

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const { 
        resetPassword 
    } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        if (!email) {
            setError('Please enter your email address.');
            return;
        }

        try {
            await resetPassword(email);
            setMessage('Password reset email sent! Check your inbox.');
        } catch (err) {
            setError('Failed to send reset email. Ensure the email is correct and registered.');
            console.error(err);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="p-8 bg-white rounded-lg shadow-xl w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Forgot Password</h2>
                <p className="mb-6 text-gray-600">Enter your email to receive a password reset link.</p>

                {message && <p className="p-3 mb-4 text-sm text-green-700 bg-green-100 rounded-lg">{message}</p>}
                {error && <p className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">{error}</p>}
                
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="email">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="you@example.com"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out w-full"
                    >
                        Send Reset Link
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;