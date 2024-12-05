import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/GuestNavbar.css';

const GuestNavbar = () => {
    const navigate = useNavigate();

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

            {/* Right Side - Login Button */}
            <div className="navbar-right">
                <button
                    className="navbar-login-button"
                    onClick={() => navigate('/login')}
                >
                    Log In
                </button>
            </div>
        </nav>
    );
};

export default GuestNavbar;
