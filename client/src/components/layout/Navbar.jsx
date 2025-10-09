import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-gray-100 p-4 rounded-md flex justify-between items-center">
      <Link to={user ? "/dashboard" : "/"} className="text-xl font-bold">
        AuthFlow
      </Link>
      <div>
        {user ? (
          <>
            <Link to="/dashboard" className="mr-4">Dashboard</Link>
            <button onClick={handleLogout} className="bg-red-500 text-white px-3 py-1 rounded">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="mr-4">Login</Link>
            <Link to="/signup" className="bg-blue-500 text-white px-3 py-1 rounded">
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;