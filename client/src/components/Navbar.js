import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Navbar.css'; // Import the new CSS file

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
            {/* Logo or Home Button */}
            <Link to="/dashboard" className="navbar-logo">
                ScrollSpace
            </Link>

            {/* Right Side - Profile Picture and Logout */}
            <div className="navbar-right">
                <img
                    src={profilePicture}
                    alt="Profile"
                    className="navbar-profile-picture"
                    onClick={() => navigate('/profile')}
                />
                <button onClick={handleLogout} className="navbar-logout-button">
                    Logout
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
