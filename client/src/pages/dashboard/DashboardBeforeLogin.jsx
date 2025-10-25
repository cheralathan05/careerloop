import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { Card } from '../../components/common/Card.jsx'; // <-- Correct: Using named import
import { Button } from '../../components/common/Button.jsx'; // <-- Correct: Using named import

// --- Custom Hook for Looping Typing Animation (Unchanged) ---
const useTypingAnimation = (texts, speed = 50, pause = 3000) => {
  const [displayedText, setDisplayedText] = useState('');
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    const cursorInterval = setInterval(() => setShowCursor(prev => !prev), 500);
    return () => clearInterval(cursorInterval);
  }, []);

  useEffect(() => {
    if (isTyping) {
      if (charIndex < texts[textIndex].length) {
        const timeout = setTimeout(() => {
          setDisplayedText(prev => prev + texts[textIndex][charIndex]);
          setCharIndex(prev => prev + 1);
        }, speed);
        return () => clearTimeout(timeout);
      } else {
        setIsTyping(false);
        const pauseTimeout = setTimeout(() => {
          setIsTyping(true);
          setCharIndex(0);
          setDisplayedText('');
          setTextIndex(prev => (prev + 1) % texts.length);
        }, pause);
        return () => clearTimeout(pauseTimeout);
      }
    }
  }, [charIndex, isTyping, textIndex, texts, speed, pause]);

  return { displayText: displayedText, showCursor };
};

// --- Neo-Futuristic Digital Background and Particle Effect ---
const DigitalBackground = () => {
  return (
    <div className="fixed inset-0 bg-gray-900 overflow-hidden pointer-events-none z-0">
      {/* Main Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(29, 78, 216, 0.2) 1px, transparent 1px), 
                             linear-gradient(to bottom, rgba(29, 78, 216, 0.2) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Floating Neon Particles */}
      {Array.from({ length: 50 }, (_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full shadow-lg"
          style={{
            width: Math.random() * 8 + 2,
            height: Math.random() * 8 + 2,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            backgroundColor: i % 2 === 0 ? '#06B6D4' : '#C026D3', // Cyan/Purple
            filter: 'blur(2px)',
          }}
          animate={{
            x: [0, Math.random() * 200 - 100, 0],
            y: [0, Math.random() * 200 - 100, 0],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{ 
            duration: Math.random() * 20 + 10, 
            repeat: Infinity, 
            delay: Math.random() * 5, 
            ease: 'linear' 
          }}
        />
      ))}
    </div>
  );
};


// --- Animated Card Grid for Steps (Neo-Futuristic Style) ---
const AnimatedCardGrid = ({ title, steps, initialDelay = 0 }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: initialDelay },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: 'spring', stiffness: 80, damping: 15 },
    },
    hover: { 
      scale: 1.05, 
      boxShadow: '0 0 20px #06B6D4, 0 0 40px #C026D3', // Neon glow effect
      transition: { duration: 0.3 } 
    },
  };

  return (
    <section className="py-20 bg-gray-900/70 backdrop-blur-sm rounded-3xl shadow-2xl border border-blue-800 mx-4 my-16">
      <motion.h2
        className="text-4xl md:text-5xl font-extrabold text-center mb-12 
                  bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500"
        initial={{ opacity: 0, y: -30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
      >
        {title}
      </motion.h2>
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-8"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        {steps.map((step, index) => (
          <motion.div
            key={step.step}
            variants={cardVariants}
            whileHover="hover"
            className="bg-gray-800 rounded-xl p-6 shadow-xl border border-blue-700 hover:border-cyan-400 transition-colors duration-300"
          >
            <div className="text-4xl mb-4 text-cyan-400">{step.icon}</div>
            <h3 className="text-xl font-bold text-white mb-2">{step.phase}</h3>
            <p className="text-gray-400 mb-4">{step.description}</p>
            <p className="text-sm font-semibold text-purple-400">Next Node: {step.next}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

// --- All Steps Data (Unchanged - Now presented in the new style) ---
const onboardingSteps = [
  { step: 5, phase: 'Access Terminal', description: 'Product intro and "Start Onboarding."', next: 'User Details Form', icon: '🚀' },
  { step: 6, phase: 'User Data Input', description: 'Collects name, education, skills.', next: 'Domain Selection', icon: '📝' },
  { step: 7, phase: 'AI Domain Mapping', description: 'AI suggests career domains.', next: 'Skill Assessment', icon: '🎯' },
  { step: 8, phase: 'Skill Matrix Calibration', description: 'Quiz tests user\'s skill levels.', next: 'Onboarding Summary', icon: '🧠' },
  { step: 9, phase: 'Process Summary Log', description: 'Shows progress map & AI recommendations.', next: 'AI Onboarding Assistant', icon: '📊' },
  { step: 10, phase: 'AI Guidance Protocol', description: 'Chat bot guides next steps.', next: 'Dashboard Home', icon: '🤖' },
];

const dashboardSteps = [
  { step: 11, phase: 'Core Hub Access', description: 'User\'s main hub after login.', next: 'Planner, Topics, etc.', icon: '🏠' },
  { step: 12, phase: 'Progress Metrics View', description: 'Graphs show skill & XP growth.', next: 'AI Dashboard Insights', icon: '📈' },
  { step: 16, phase: 'AI Insights Analysis', description: 'AI analyzes performance & suggests next tasks.', next: 'Planner Phase', icon: '🔍' },
  { step: 17, phase: 'Daily Task Sequence', description: 'View daily tasks & progress.', next: 'Weekly Goals', icon: '📅' },
  { step: 18, phase: 'Weekly Goal Matrix', description: 'AI suggests goals based on history.', next: 'Task Editor', icon: '🎯' },
  { step: 20, phase: 'Task Priority Engine', description: 'Orders tasks by urgency.', next: 'Smart Reminder', icon: '⚡' },
];

const topicsSteps = [
  { step: 22, phase: 'Curriculum Index', description: 'Courses based on domain.', next: 'Topic Sidebar', icon: '📚' },
  { step: 24, phase: 'Knowledge Stream', description: 'Learning materials (videos, articles).', next: 'Topic Quiz', icon: '🎥' },
  { step: 26, phase: 'AI Knowledge Navigator', description: 'Suggests related topics & AI paths.', next: 'AI Assistant Phase', icon: '🧠' },
  { step: 27, phase: 'AI Assistant Console', description: 'Main chat bot dashboard.', next: 'Smart Prompt Panel', icon: '🤖' },
  { step: 30, phase: 'AI Career Mentor', description: 'Personalized career guidance.', next: 'Skill Gap Analyzer', icon: '👨‍🏫' },
  { step: 31, phase: 'Skill Gap Detector', description: 'Finds missing skills & suggests courses.', next: 'Mentor Matchmaker', icon: '🔍' },
];

const serviceSteps = [
  { step: 33, phase: 'Skill to Service Protocol', description: 'Converts skills into freelance services.', next: 'Suggested Services', icon: '🔄' },
  { step: 36, phase: 'AI Service Optimization', description: 'Suggests pricing & positioning.', next: 'Mock Interview Phase', icon: '📈' },
  { step: 38, phase: 'Interview Question Generator', description: 'AI creates real interview Q\'s.', next: 'Real-Time Feedback', icon: '❓' },
  { step: 39, phase: 'Real-Time Response Analysis', description: 'AI analyzes voice/text responses.', next: 'Interview Summary', icon: '🔊' },
  { step: 41, phase: 'AI Interview Coaching', description: 'Gives improvement tips.', next: 'Behavioral Interviewer', icon: '🎓' },
  { step: 42, phase: 'Behavioral Simulation', description: 'Simulates personality questions.', next: 'Resume Phase', icon: '🧑' },
];

const resumeSteps = [
  { step: 43, phase: 'Resume Build Matrix', description: 'Drag-and-drop interface.', next: 'Resume Preview', icon: '🛠️' },
  { step: 45, phase: 'Document Export', description: 'Export PDF/DOCX/Image.', next: 'Templates', icon: '📤' },
  { step: 47, phase: 'ATS Optimization Engine', description: 'Improves wording & ATS format.', next: 'Certificates Phase', icon: '🤖' },
  { step: 48, phase: 'Credential Generator', description: 'Creates certificate files.', next: 'Preview', icon: '🎨' },
  { step: 51, phase: 'AI Certificate Designer', description: 'Auto designs styles.', next: 'Skill Badge', icon: '🖼️' },
  { step: 52, phase: 'Digital Credential Creator', description: 'Creates shareable badges.', next: 'Feedback Phase', icon: '🏅' },
];

const advancedSteps = [
  { step: 53, phase: 'User Feedback Stream', description: 'Collects ratings & opinions.', next: 'Rating & Review', icon: '💬' },
  { step: 55, phase: 'Feedback Summary Report', description: 'Shows aggregate feedback.', next: 'AI Feedback Analyzer', icon: '📈' },
  { step: 56, phase: 'AI Insight Extractor', description: 'Extracts insights for improvements.', next: 'Experience Tracker', icon: '🔍' },
  { step: 58, phase: 'User Profile Configuration', description: 'Update profile details.', next: 'Theme Preferences', icon: '⚙️' },
  { step: 61, phase: 'AI Personalization Control', description: 'Configure AI behavior.', next: 'AI Privacy Guard', icon: '🤖' },
  { step: 62, phase: 'Data Privacy Guard', description: 'Alerts for data security.', next: 'Error Phase', icon: '🛡️' },
  { step: 65, phase: 'AI Error Recovery', description: 'Detects & auto-fixes issues.', next: 'Auto-Fix', icon: '🩹' },
  { step: 66, phase: 'UI Auto-Fix Assistant', description: 'UI/UX auto-healing.', next: 'Community Phase', icon: '🛠️' },
  { step: 67, phase: 'Collaborative Project Hub', description: 'Team projects hub.', next: 'Global Events', icon: '🤝' },
  { step: 69, phase: 'AI Networking Connector', description: 'Connects users with peers.', next: 'Discussion Moderator', icon: '🌐' },
  { step: 73, phase: 'AI Career Path Simulator', description: 'Predicts career growth.', next: 'Insights', icon: '🔮' },
  { step: 75, phase: 'AI Personal Branding', description: 'Optimizes LinkedIn & Portfolio.', next: 'End / Loop Back', icon: '🌟' },
];

// --- Main DashboardBeforeLogin Component (Final Neo-Futuristic) ---
const DashboardBeforeLogin = () => {
  const typingPhrases = [
    'System Status: Authentication Complete.',
    'Executing Onboarding Protocol Alpha.',
    '75+ Core Modules Initialized. Processing Power: Unlimited.',
  ];
  const { displayText, showCursor } = useTypingAnimation(typingPhrases, 50, 3000);

  return (
    <div className="relative min-h-screen bg-gray-900 text-gray-200 overflow-hidden">
      <DigitalBackground />

      <div className="relative z-10 py-16">
        {/* Hero Section: Access Terminal */}
        <section className="min-h-[80vh] flex items-center justify-center px-4">
          <div className="text-center max-w-5xl bg-gray-900/60 p-10 rounded-xl border border-blue-800 shadow-2xl shadow-cyan-900/50">
            <motion.h1
              className="text-6xl md:text-8xl font-black mb-6 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500"
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, type: 'spring' }}
            >
              CareerLoop.AI
            </motion.h1>
            <motion.div
              className="text-xl md:text-3xl font-mono mb-8 h-12 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <span className="text-cyan-400">{displayText}</span>
              {showCursor && <motion.span animate={{ opacity: [1, 0, 1] }} transition={{ duration: 0.5, repeat: Infinity }} className="text-purple-400 ml-1">_</motion.span>}
            </motion.div>
            <motion.p
              className="text-lg md:text-xl text-gray-400 mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5 }}
            >
              Your personalized, AI-driven career path awaits. Review the data modules below, then initiate **Onboarding Protocol** to proceed to the main hub.
            </motion.p>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 2, type: 'spring' }}
            >
              <Link to="/onboarding">
                <Button 
                  className="bg-gradient-to-r from-cyan-500 to-purple-500 
                              hover:from-cyan-400 hover:to-purple-400 
                              px-16 py-4 text-2xl font-bold text-white shadow-lg shadow-purple-500/50"
                >
                  INITIATE ONBOARDING PROTOCOL
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* --- Full Application Roadmap Modules --- */}
        <div className="max-w-7xl mx-auto">
          <AnimatedCardGrid 
            title="Module 1: Onboarding Protocol (Steps 5-10)" 
            steps={onboardingSteps} 
            initialDelay={0.1}
          />

          <AnimatedCardGrid 
            title="Module 2: Core Dashboard & Planning (Steps 11-21)" 
            steps={dashboardSteps} 
            initialDelay={0.2}
          />

          <AnimatedCardGrid 
            title="Module 3: Knowledge & AI Coaching (Steps 22-32)" 
            steps={topicsSteps} 
            initialDelay={0.3}
          />

          <AnimatedCardGrid 
            title="Module 4: Service Monetization & Simulations (Steps 33-42)" 
            steps={serviceSteps} 
            initialDelay={0.4}
          />

          <AnimatedCardGrid 
            title="Module 5: Digital Credentials & Documentation (Steps 43-52)" 
            steps={resumeSteps} 
            initialDelay={0.5}
          />

          <AnimatedCardGrid 
            title="Module 6: System Configuration & Security (Steps 53-62)" 
            steps={advancedSteps.slice(0, 6)}
            initialDelay={0.6}
          />

          <AnimatedCardGrid 
            title="Module 7: Network & Predictive AI (Steps 63-75)" 
            steps={advancedSteps.slice(6)}
            initialDelay={0.7}
          />
        </div>

        {/* Final Call-to-Action Section */}
        <motion.section
          className="text-center py-16 bg-gray-900/70 rounded-xl shadow-lg mt-24 border border-blue-800"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true, amount: 0.5 }}
        >
          <h2 className="text-3xl font-bold text-white mb-6">
            System Ready. Deploy Your Career Trajectory.
          </h2>
          <Link to="/onboarding">
            <Button 
              className="bg-gradient-to-r from-purple-500 to-cyan-500 
                        hover:from-purple-400 hover:to-cyan-400 
                        px-10 py-4 text-xl font-bold text-white shadow-xl shadow-cyan-500/30"
            >
              START CUSTOMIZING
            </Button>
          </Link>
        </motion.section>

      </div>
    </div>
  );
};

export default DashboardBeforeLogin;