// client/src/pages/auth/DashboardBeforeLogin.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/common/Card.jsx';
import Button from '../../components/common/Button.jsx';

const DashboardBeforeLogin = () => {
  return (
    <div className="flex flex-col w-full bg-white flex-grow">
      
      {/* Container wraps content and limits width */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 py-12">

        {/* 1. Hero Section */}
        <section className="text-center py-16 bg-gradient-to-br from-white to-indigo-50 rounded-xl shadow-lg">
          <h1 className="text-5xl md:text-6xl font-extrabold text-indigo-700 mb-4 tracking-tight">
            Seamless & Secure Authentication
          </h1>
          <p className="text-gray-600 text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Experience modern login flows with OTP, social auth, and robust security—built with performance in mind.
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/signup">
              <Button 
                className="bg-indigo-600 hover:bg-indigo-700 px-8 py-3 text-lg shadow-indigo-500/50 shadow-md"
              >
                Start Free Account
              </Button>
            </Link>
            <Link to="/login">
              <Button 
                className="bg-white text-indigo-600 border border-indigo-600 hover:bg-indigo-50 px-8 py-3 text-lg"
              >
                Log In
              </Button>
            </Link>
          </div>
        </section>
        {/*  */}

        {/* 2. Feature Cards Section */}
        <section>
          {/* Ensure h2 is used for section title */}
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">
            Why Choose AuthFlow?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card
              // Use titleAs="h3" to maintain heading hierarchy (H1->H2->H3)
              titleAs="h3"
              title="Secure Authentication"
              description="Implement OTP (email/SMS), robust password hashing, and token-based security seamlessly."
              className="hover:shadow-indigo-200 hover:shadow-xl transition-shadow duration-300"
            />
            <Card
              titleAs="h3"
              title="Google OAuth"
              description="Integrate social login with Google to provide instant sign-up and a better user experience."
              className="hover:shadow-indigo-200 hover:shadow-xl transition-shadow duration-300"
            />
            <Card
              titleAs="h3"
              title="Modern Tech Stack"
              description="Built on React, Tailwind CSS, and a modular service architecture for speed and maintainability."
              className="hover:shadow-indigo-200 hover:shadow-xl transition-shadow duration-300"
            />
          </div>
        </section>

        {/* 3. Final Call-to-Action Section */}
        <section className="text-center py-16 bg-indigo-50/50 rounded-xl">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            Get started in seconds.
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Your secure login journey is just one click away.
          </p>
          <Link to="/signup">
            <Button className="bg-indigo-600 hover:bg-indigo-700 px-8 py-3 text-lg shadow-xl">
              Create My Account Now
            </Button>
          </Link>
        </section>

      </div>
    </div>
  );
};

export default DashboardBeforeLogin;