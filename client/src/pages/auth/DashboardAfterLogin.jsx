// client/src/pages/auth/DashboardAfterLogin.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/common/Card.jsx';
import Button from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';
// 🚨 NOTE: In a real app, replace the emoji icons with an icon library (e.g., Lucide, React Icons)

// --- Quick Action Card Component ---
const QuickActionCard = ({ title, description, link, icon }) => (
  // Wrap the Card content in a Link for the entire card to be clickable
  <Link 
    to={link} 
    className="block transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg"
  >
    <Card className="flex flex-col items-center justify-center p-6 h-full text-center">
      <div className="text-indigo-600 text-4xl mb-3">{icon}</div> 
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-gray-500 text-sm">{description}</p>
    </Card>
  </Link>
);

const DashboardAfterLogin = () => {
  const { user } = useAuth();
  
  // Use a fallback for the name, extracting from email if necessary (consistent with AuthContext)
  const userName = user?.name || user?.email?.split('@')[0] || 'User';

  return (
    <div className="flex flex-col w-full bg-gray-50 flex-grow py-8">
      
      {/* 🚨 ENHANCEMENT 1: Center and limit content width */}
      <div className="container mx-auto px-4 max-w-7xl"> 

        {/* --- Welcome Section --- */}
        <section className="mb-10 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-2">
            Welcome back, {userName}!
          </h1>
          <p className="text-xl text-gray-600">
            Explore your dashboard and continue leveling up your career.
          </p>
        </section>

        {/* --- Quick Actions --- */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            <QuickActionCard
              title="Mock Interviews"
              description="Practice interview questions and get instant feedback."
              link="/mock-interview"
              icon="🎤" // Replace with proper Icon component
            />
            <QuickActionCard
              title="Resume Builder"
              description="Create or update your professional resume quickly."
              link="/resume"
              icon="📝" // Replace with proper Icon component
            />
            <QuickActionCard
              title="Skill Assessment"
              description="Test your skills and track your progress."
              link="/topics"
              icon="📊" // Replace with proper Icon component
            />
            <QuickActionCard
              title="Certificates"
              description="View and download your earned certificates."
              link="/certificates"
              icon="🎓" // Replace with proper Icon component
            />
            <QuickActionCard
              title="AI Assistant"
              description="Get personalized career guidance powered by AI."
              link="/ai-assistant"
              icon="🤖" // Replace with proper Icon component
            />
          </div>
        </section>

        {/* --- Progress Overview --- */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Progress Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* XP & Levels Card */}
            <Card 
                // 🚨 Using titleAs to maintain correct heading hierarchy (h3 nested under h2)
                titleAs="h3" 
                title="XP & Levels"
                className="p-6"
            >
              <p className="text-gray-600">You have earned 1,250 XP. Keep completing tasks to level up!</p>
              <div className="w-full bg-gray-200 rounded-full h-4 mt-3">
                <div 
                  className="bg-indigo-600 h-4 rounded-full shadow-md" 
                  style={{ width: '62%' }}
                  role="progressbar" // Accessibility
                  aria-valuenow={62}
                  aria-valuemin={0}
                  aria-valuemax={100}
                ></div>
              </div>
            </Card>

            {/* Recent Achievements Card */}
            <Card 
                titleAs="h3" 
                title="Recent Achievements" 
                className="p-6"
            >
              <ul className="text-gray-600 list-disc list-inside space-y-1">
                <li className="text-sm">Completed **'React Basics'** Skill Test</li>
                <li className="text-sm">Submitted Resume Version 2.0</li>
                <li className="text-sm">Earned Certificate: **"Frontend Developer"**</li>
              </ul>
            </Card>
          </div>
        </section>

        {/* --- XP Leaderboard --- */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">XP Leaderboard</h2>
          <Card className="p-0 overflow-hidden"> {/* Remove padding from card and wrap content inside */}
            <div className="overflow-x-auto">
              <table className="w-full text-left table-auto border-collapse">
                <thead>
                  <tr className="bg-gray-100 border-b text-gray-700 uppercase text-xs">
                    <th className="py-3 px-4 font-semibold">Rank</th>
                    <th className="py-3 px-4 font-semibold">User</th>
                    <th className="py-3 px-4 font-semibold">XP</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b hover:bg-indigo-50/50">
                    <td className="py-3 px-4">1</td>
                    <td className="py-3 px-4">Alice</td>
                    <td className="py-3 px-4 font-medium">2,400</td>
                  </tr>
                  <tr className="border-b hover:bg-indigo-50/50">
                    <td className="py-3 px-4">2</td>
                    <td className="py-3 px-4">Bob</td>
                    <td className="py-3 px-4 font-medium">2,100</td>
                  </tr>
                  {/* Highlight the current user row */}
                  <tr className="bg-indigo-100/70 border-b border-indigo-300 font-bold hover:bg-indigo-100">
                    <td className="py-3 px-4">3</td>
                    <td className="py-3 px-4 text-indigo-800">You</td>
                    <td className="py-3 px-4 text-indigo-800">1,250</td>
                  </tr>
                  {/* Placeholder rows */}
                  <tr className="border-b hover:bg-indigo-50/50">
                    <td className="py-3 px-4">4</td>
                    <td className="py-3 px-4">Charlie</td>
                    <td className="py-3 px-4">1,100</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>
        </section>

        {/* --- CTA Section --- */}
        <section className="text-center pb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            Ready to jump into your next challenge?
          </h3>
          <Link to="/topics">
            <Button className="px-8 py-3 text-lg shadow-lg">
              Explore Topics & Start Learning
            </Button>
          </Link>
        </section>

      </div> 
    </div>
  );
};

export default DashboardAfterLogin;