import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
    const { user } = useAuth();

    // In a real app, you might decode the token or have user info in the user object
    const userEmail = user?.email || 'user';

    return (
        <div className="text-center">
            <h1 className="text-3xl font-bold">Welcome to the Dashboard!</h1>
            <p className="mt-4">You are logged in{userEmail && ` as ${userEmail}`}.</p>
        </div>
    );
};

export default Dashboard;