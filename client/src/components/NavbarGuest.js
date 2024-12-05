import React, { useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import '../styles/Navbar.css'; // Import the new CSS file

const NavbarGuest = ({ guestMode }) => {
    const navigate = useNavigate();
    const location = useLocation(); // Access location here to trigger re-renders on route change

    // Force Navbar re-render when location changes
    useEffect(() => {
        // Side effect you want to trigger on route change (empty if no side effects needed)
    }, [location]); // Dependency on location ensures re-render on route change

    return (
        <nav className="navbar">
            {/* Logo or Home Button */}
            <Link to="/" className="navbar-logo">
                ScrollSpace
            </Link>

            {/* Right Side - Conditionally Rendered Buttons for Guest Mode */}
            <div className="navbar-right">
                {guestMode && (
                    <>
                        <Link to="/login">
                            <button className="homepage-button">Login</button>
                        </Link>
                        <Link to="/signup">
                            <button className="homepage-button">Sign Up</button>
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default NavbarGuest;
