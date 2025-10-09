import { useAuth } from '../hooks/useAuth';

const ProtectedDashboard = () => {
    const { user, logout } = useAuth();
    return (
        <div>
            <h1>Welcome, {user?.name}!</h1>
            <p>This is your protected dashboard.</p>
            <button onClick={logout}>Logout</button>
        </div>
    );
};
export default ProtectedDashboard;