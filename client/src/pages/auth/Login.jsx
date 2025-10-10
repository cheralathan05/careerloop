// client/src/pages/auth/Login.jsx (FINAL CORRECTED VERSION with Signup Link)

import AuthForm from '../../components/auth/AuthForm';
import GoogleButton from '../../components/auth/GoogleButton'; 
import { Link } from 'react-router-dom'; // 👈 CRITICAL: Link Import Added

const Login = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="w-full max-w-sm">
          <AuthForm type="login" />
          
          {/* ✅ OR Separator */}
          <div className="flex items-center my-4">
              <hr className="flex-grow border-gray-300" />
              <span className="px-3 text-gray-500 text-sm">OR</span>
              <hr className="flex-grow border-gray-300" />
          </div>
          
          {/* ✅ Google Button Addition */}
          <GoogleButton />

          {/* 🎯 Link to Signup Page */}
          <p className="text-center text-sm mt-4 text-gray-600">
              Don't have an account? 
              <Link to="/signup" className="text-indigo-600 hover:text-indigo-800 ml-1 font-medium">
                  Sign up here
              </Link>
          </p>
      </div>
    </div>
  );
};

export default Login;