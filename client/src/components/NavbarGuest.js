import React, { useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import '../styles/NavbarGuest.css';

const NavbarGuest = ({ guestMode }) => {
    const navigate = useNavigate();
    const location = useLocation(); // Access location here to trigger re-renders on route change

    // Force Navbar re-render when location changes
    useEffect(() => {
        // Side effect you want to trigger on route change (empty if no side effects needed)
    }, [location]); // Dependency on location ensures re-render on route change

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

            {/* Right Side - Conditionally Rendered Buttons for Guest Mode */}
            <div className="navbar-right">
                {guestMode && (
                    <>
                        <Link to="/login">
                            <button className="navbar-login-button">Login</button>
                        </Link>
                        <Link to="/signup">
                            <button className="navbar-signup-button">Sign Up</button>
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default NavbarGuest;
