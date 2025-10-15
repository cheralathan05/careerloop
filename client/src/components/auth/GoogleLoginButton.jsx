import authService from '../../api/authService';

const GoogleLoginButton = () => (
    <button
        onClick={authService.googleLogin}
        className="bg-red-500 text-white px-4 py-2 rounded-md"
    >
        Continue with Google
    </button>
);

export default GoogleLoginButton;
