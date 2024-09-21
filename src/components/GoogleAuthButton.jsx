import './AuthStyles.css';

const GoogleAuthButton = () => {

    console.log("Vit" + import.meta.env.VITE_REACT_APP_HOST)
    const handleGoogleSignIn = () => {
        // Redirect to your server's Google OAuth endpoint
        window.location.href = `${import.meta.env.VITE_REACT_APP_HOST}/auth/google`;
    };

    return (
        <button className="google-button" onClick={handleGoogleSignIn}>
            Sign in with Google
        </button>
    );
};

export default GoogleAuthButton;
