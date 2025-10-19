// client/src/pages/auth/Login.jsx

import { motion } from 'framer-motion';
import AuthForm from '../../components/auth/AuthForm.jsx';
import GoogleButton from '../../components/auth/GoogleButton.jsx';
import { Link } from 'react-router-dom';

// ✅ Animation Variants (Fix)
const containerVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' }
  }
};

const Login = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <motion.div
        className="w-full max-w-sm"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <AuthForm type="login" />
        
        {/* Separator */}
        <div className="flex items-center my-4">
          <hr className="flex-grow border-gray-300" />
          <span className="px-3 text-gray-500 text-sm">OR</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        <GoogleButton />

        {/* ✅ Forgot password + Signup link */}
        <div className="text-center text-sm mt-4 text-gray-600 space-y-2">
          <Link 
            to="/forgot-password" 
            className="text-indigo-600 hover:text-indigo-800 block"
          >
            Forgot Password?
          </Link>

          <p>
            Don’t have an account?{' '}
            <Link 
              to="/signup" 
              className="text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Sign up
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
