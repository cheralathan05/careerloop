// client/src/pages/auth/Login.jsx (ULTIMATE "BEST EVER" FRAMER MOTION FOR CAREERLOOP)
// Inspired by Linear/Notion: Magical, professional, zero-friction animations

import { motion, useReducedMotion, AnimatePresence } from 'framer-motion'; // 👈 Full Imports
import { useState } from 'react'; // For demo interactions (e.g., form state)
import AuthForm from '../../components/auth/AuthForm';
import GoogleButton from '../../components/auth/GoogleButton'; 
import { Link, useLocation } from 'react-router-dom'; // 👈 useLocation for key

// 👈 Custom Hook for Reduced Motion (Accessibility Best Practice)
const useMotionPrefs = () => useReducedMotion();

// 👈 Advanced Variants: Orchestrated for "Career Loop" Theme
const containerVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 50 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1], // Custom ease for premium feel (like Apple's)
      staggerChildren: 0.15,
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
  hidden: { opacity: 0, y: 30, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 400, // Snappier for pro feel
      damping: 30,
      mass: 0.8,
      delay: 0, // Overridden by stagger
    },
  },
};

const buttonVariants = {
  ...itemVariants,
  hover: {
    scale: 1.05,
    boxShadow: '0 10px 25px rgba(99, 102, 241, 0.3)', // Glow for CareerLoop indigo
    transition: { duration: 0.25, ease: 'easeOut' },
  },
  tap: {
    scale: 0.98, // Haptic press feedback
    transition: { duration: 0.1 },
  },
};

const linkVariants = {
  ...itemVariants,
  hover: {
    color: '#4f46e5', // Deeper indigo
    textDecoration: 'underline',
    transition: { duration: 0.2 },
  },
};

// 👈 Background Particles: Subtle "Loop" Orbits (SVG + Motion Path)
const Particle = ({ delay }) => (
  <motion.circle
    cx="50%"
    cy="50%"
    r={3}
    fill="url(#careerGradient)"
    initial={{ opacity: 0, pathLength: 0 }}
    animate={{
      opacity: 0.6,
      pathLength: 1,
      rotate: 360,
    }}
    transition={{
      duration: 20, // Slow orbit
      repeat: Infinity,
      ease: 'linear',
      delay,
    }}
  />
);

const Login = () => {
  const location = useLocation(); // 👈 For AnimatePresence key
  const prefersReducedMotion = useMotionPrefs();
  const [isSubmitting, setIsSubmitting] = useState(false); // Demo state for button animation

  // 👈 Parallax Background Wrapper
  return (
    <div className="relative flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 overflow-hidden">
      {/* 👈 Animated Background Particles (CareerLoop "Loop" Theme) */}
      {!prefersReducedMotion && (
        <svg className="absolute inset-0 w-full h-full opacity-20">
          <defs>
            <linearGradient id="careerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#a855f7" />
            </linearGradient>
            {/* Invisible path for orbiting particles */}
            <path
              id="orbitPath"
              d="M 50 50 m -40, 0 a 40,40 0 1,1 80,0 a 40,40 0 1,1 -80,0"
              fill="none"
            />
          </defs>
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
          >
            <motion.path
              d="M 50 50 m -40, 0 a 40,40 0 1,1 80,0 a 40,40 0 1,1 -80,0"
              stroke="url(#careerGradient)"
              strokeWidth={0.5}
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, ease: 'easeInOut' }}
            />
            <Particle delay={0} />
            <Particle delay={5} style={{ transform: 'rotate(120deg)' }} />
            <Particle delay={10} style={{ transform: 'rotate(240deg)' }} />
          </motion.g>
        </svg>
      )}

      {/* 👈 Parallax Effect on Container */}
      <motion.div
        className="relative w-full max-w-sm z-10"
        initial={{ y: 100 }} // Parallax slide-up
        animate={{ y: 0 }}
        transition={{ duration: 1, ease: 'easeOut' }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname} // 👈 Ensures unique key for transitions
            className="space-y-6"
            variants={!prefersReducedMotion ? containerVariants : { visible: {} }}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* 👈 AuthForm with Cascading Animation */}
            <motion.div variants={itemVariants}>
              <AuthForm 
                type="login" 
                onSubmit={() => setIsSubmitting(true)} // Demo for button state
              />
            </motion.div>
            
            {/* 👈 OR Separator */}
            <motion.div className="flex items-center my-4" variants={itemVariants}>
              <hr className="flex-grow border-gray-300" />
              <span className="px-3 text-gray-500 text-sm">OR</span>
              <hr className="flex-grow border-gray-300" />
            </motion.div>
            
            {/* 👈 Google Button with Advanced Interactions */}
            <motion.div variants={itemVariants}>
              <motion.div
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                onAnimationComplete={() => setIsSubmitting(false)}
              >
                <GoogleButton />
              </motion.div>
            </motion.div>

            {/* 👈 Signup Link with Draw-In Underline */}
            <motion.p 
              className="text-center text-sm mt-4 text-gray-600"
              variants={itemVariants}
            >
              Don't have an account? 
              <motion.span variants={linkVariants} whileHover="hover">
                <Link 
                  to="/signup" 
                  className="text-indigo-600 hover:text-indigo-800 ml-1 font-medium"
                >
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
