import { Routes, Route } from 'react-router-dom';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import VerifyOTP from '../pages/VerifyOTP';
import Dashboard from '../pages/Dashboard';
import LandingPage from '../pages/LandingPage';
import ProtectedRoute from './ProtectedRoute';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/verify-otp" element={<VerifyOTP />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;