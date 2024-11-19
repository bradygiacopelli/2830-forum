import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

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
        <nav style={styles.navbar}>
            {/* Logo or Home Button */}
            <Link to="/dashboard" style={styles.logo}>
                ScrollSpace
            </Link>

            {/* Right Side - Profile Picture and Logout */}
            <div style={styles.navRight}>
                <img
                    src={profilePicture}
                    alt="Profile"
                    style={styles.profilePicture}
                    onClick={() => navigate('/profile')}
                />
                <button onClick={handleLogout} style={styles.logoutButton}>Logout</button>
            </div>
        </nav>
    );
};

const styles = {
    navbar: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 20px',
        backgroundColor: '#333',
        color: '#fff',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
    },
    logo: {
        color: '#fff',
        textDecoration: 'none',
        fontSize: '24px',
    },
    navRight: {
        display: 'flex',
        alignItems: 'center',
    },
    profilePicture: {
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        cursor: 'pointer',
        marginRight: '10px',
    },
    logoutButton: {
        padding: '5px 10px',
        backgroundColor: 'red',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
};

export default Navbar;
