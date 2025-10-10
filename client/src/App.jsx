// client/src/App.jsx

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Import Layout Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Import Route Guard
import ProtectedRoute from './components/routes/ProtectedRoute';
// import RoleBasedRoute from './components/routes/RoleBasedRoute'; // For future implementation

// Import Pages
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import VerifyOTP from './pages/auth/VerifyOTP';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';

import DashboardBeforeLogin from './pages/auth/DashboardBeforeLogin';
import DashboardAfterLogin from './pages/auth/DashboardAfterLogin';
import NotFound from './pages/NotFound';

const App = () => {
  return (
    // Wrap the entire application with AuthProvider for state management
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
            <Navbar />
            
            <main className="flex-grow">
              <Routes>
                {/* --- Public Routes --- */}
                
                {/* Homepage (Before Login Dashboard) */}
                <Route path="/" element={<DashboardBeforeLogin />} /> 
                
                {/* Authentication Pages */}
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/verify-otp" element={<VerifyOTP />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                
                {/* Reset password token is passed via query params (e.g., /reset-password?token=...) */}
                <Route path="/reset-password" element={<ResetPassword />} /> 

                {/* --- Protected Routes --- */}
                
                {/* Use ProtectedRoute as the container for routes requiring authentication */}
                <Route element={<ProtectedRoute />}>
                    <Route path="/dashboard" element={<DashboardAfterLogin />} />
                    {/* Add other protected routes here (e.g., /profile, /settings) */}
                </Route>
                
                {/* --- Role-Based Routes (Example) --- */}
                {/* <Route element={<RoleBasedRoute allowedRoles={['admin']} />}>
                    <Route path="/admin" element={<AdminDashboard />} />
                </Route> */}

                {/* --- 404 Catch-all Route --- */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            
            <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;