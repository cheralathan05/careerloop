// client/src/pages/auth/Login.jsx

import { motion, useReducedMotion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import AuthForm from '../../components/auth/AuthForm';
import GoogleButton from '../../components/auth/GoogleButton';

// --- Custom Hook for Reduced Motion Preference ---
const useMotionPrefs = () => useReducedMotion();

// --- Animation Variants ---
const containerVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 50 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: -20,
    transition: { duration: 0.3, ease: 'easeInOut' },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 350, damping: 30, mass: 0.8 },
  },
};

const buttonVariants = {
  ...itemVariants,
  hover: {
    scale: 1.02,
    boxShadow: '0 8px 20px rgba(99, 102, 241, 0.25)',
    transition: { duration: 0.2, ease: 'easeOut' },
  },
  tap: { scale: 0.98, transition: { duration: 0.1 } },
};

const linkVariants = {
  ...itemVariants,
  hover: { color: '#4f46e5', transition: { duration: 0.2 } },
};

// --- Background Particle Component ---
const Particle = ({ delay }) => (
  <motion.circle
    cx="50%"
    cy="50%"
    r={3}
    fill="url(#careerGradient)"
    initial={{ opacity: 0 }}
    animate={{ opacity: 0.6, rotate: 360 }}
    transition={{ duration: 25, repeat: Infinity, ease: 'linear', delay }}
  />
);

const Login = () => {
  const location = useLocation();
  const prefersReducedMotion = useMotionPrefs();
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <div className="relative flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 overflow-hidden p-4">
      
      {/* Animated Background Particles */}
      {!prefersReducedMotion && (
        <svg className="absolute inset-0 w-full h-full opacity-20 max-w-lg max-h-lg mx-auto pointer-events-none">
          <defs>
            <linearGradient id="careerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#a855f7" />
            </linearGradient>
          </defs>
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 1 }}>
            <Particle delay={0} />
            <Particle delay={8} />
            <Particle delay={16} />
          </motion.g>
        </svg>
      )}

      {/* Login Form Container */}
      <motion.div
        className="relative w-full max-w-sm z-10"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            className="space-y-6"
            variants={!prefersReducedMotion ? containerVariants : { visible: { opacity: 1 } }}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* AuthForm */}
            <motion.div variants={itemVariants}>
              <AuthForm type="login" onSubmit={() => setIsSubmitting(true)} />
            </motion.div>

            {/* OR Separator */}
            <motion.div className="flex items-center my-4" variants={itemVariants}>
              <hr className="flex-grow border-gray-300" />
              <span className="px-3 text-gray-500 text-sm">OR</span>
              <hr className="flex-grow border-gray-300" />
            </motion.div>

            {/* Google Login */}
            <motion.div variants={itemVariants}>
              <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap" onAnimationComplete={() => setIsSubmitting(false)}>
                <GoogleButton />
              </motion.div>
            </motion.div>

            {/* Signup Link */}
            <motion.p className="text-center text-sm mt-4 text-gray-600" variants={itemVariants}>
              Don't have an account?{' '}
              <motion.span variants={linkVariants} whileHover="hover">
                <Link to="/signup" className="text-indigo-600 ml-1 font-medium">
                  Sign up here
                </Link>
              </motion.span>
            </motion.p>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default Login;
