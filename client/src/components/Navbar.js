import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Navbar.css'; // Import the CSS file

const Navbar = ({ setIsAuthenticated, profilePicture, refreshProfilePicture }) => {
    const navigate = useNavigate();

    useEffect(() => {
        refreshProfilePicture(); // Ensure navbar picture is always up-to-date
    }, [refreshProfilePicture]);

    const handleLogout = () => {
        localStorage.clear(); // Clear user session
        setIsAuthenticated(false); // Update auth state
        navigate('/'); // Redirect to home page
    };

    return (
        <nav className="navbar">
            {/* Left Side - Logo */}
            <div className="navbar-left" onClick={() => navigate('/dashboard')}>
                <img
                    src="/image.png" // Path to the logo in `public`
                    alt="ScrollSpace Logo"
                    className="navbar-logo-image"
                />
            </div>

            {/* Right Side - Profile Picture and Logout */}
            <div className="navbar-right">
                <img
                    src={profilePicture}
                    alt="Profile"
                    className="navbar-profile-picture"
                    onClick={() => navigate('/profile')}
                />
                <button onClick={() => handleLogout()} className="navbar-logout-button">
                    Logout
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
