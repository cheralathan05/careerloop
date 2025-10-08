// src/components/auth/LoginForm.jsx

import React, { 
    useState 
} from 'react';
import { 
    useAuth 
} from '../../hooks/useAuth';
import { 
    useNavigate 
} from 'react-router-dom';

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { 
        login 
    } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        // Basic validation (use utils/validators.js for full implementation)
        if (!email || !password) {
            setError('Please fill in both fields.');
            return;
        }

        try {
            await login(email, password);
            navigate('/dashboard'); // Redirect to dashboard on success
        } catch (err) {
            setError('Failed to log in. Check your email and password.');
            console.error(err);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-8 bg-white rounded-lg shadow-xl w-full max-w-md">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">Sign In</h2>
            
            {error && (
                <p className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
                    {error}
                </p>
            )}

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

            <div className="mb-6">
                <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="password">
                    Password
                </label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="********"
                    required
                />
            </div>

            <div className="flex items-center justify-between">
                <button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out w-full"
                >
                    Log In
                </button>
            </div>
        </form>
    );
};

export default LoginForm;